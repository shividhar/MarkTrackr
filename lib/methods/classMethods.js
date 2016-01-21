Meteor.methods({
    createClass: function(classData){
    	if(Meteor.isServer){
    		//Properties:
    			// title
    			// categoryWeightings
    				// *should match categories property*
    				// *should be decimal percents"
    			//  assessmentTypes
    				// [Array of Objects]

    				// typeName
    				// weight
    				// categories
	    	//Login Control
	    	if (!Meteor.userId()) {
		      throw new Meteor.Error("Please login to do that.");
		    }
		    if(Classes.findOne({"authorId": Meteor.userId(), "title": classData.title})){
		    	throw new Meteor.Error("Error: Class already exists");
		    }
		    if(!classData.title || !classData.categoryWeightings || !classData.assessmentTypes){
		    	throw new Meteor.Error("Error: Failed to create class");
		    }

		    var fields = {
		    	"createdAt": new Date(),
		    	"authorId": Meteor.userId(),
		    	"title": classData.title,
		    	"categories": ["knowledge", "thinking", "communication", "application"],
		    	"categoryWeightings": classData.categoryWeightings,
		    	"assessmentTypes": classData.assessmentTypes
		    }

		    return Classes.insert(fields)
		}
	},
	changeClassTitle: function(classData){
		if(Meteor.isServer){
			//Properties:
				// classId
				// newTitle
			if(!Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId()})){
				throw new Meteor.Error("Error: Failed to change class title")
			}

			if(!classData.newTitle){
				throw new Meteor.Error("Error: Please supply a title");
			}

			Classes.update({"_id": classData.classId, "authorId": Meteor.userId()}, {$set: {"title": classData.newTitle}});
		}
	},
	addAssessmentType: function(classData){
		if(Meteor.isServer){
			//Properties:
				// classId
				// newAssessmentTypeName
				// newAssessmentTypeWeighting
				// newAssessmentTypeCategories

			if(!classData.newAssessmentType){
				throw new Meteor.Error("Error: Please supply proper values");
			}

			if(!Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId()}) || Classes.findOne({"_id": classData.classId, "assessmentTypes.typeName": classData.newAssessmentType.typeName})){
				throw new Meteor.Error("Error: Failed to add assessment")
			}

			Classes.update({"_id": classData.classId, "authorId": Meteor.userId()}, {$push: {"assessmentTypes": classData.newAssessmentType}});
		}
	},
	deleteAssessmentType: function(classData){
		if(Meteor.isServer){
			if(!classData.assessmentTypeToDelete){
				throw new Meteor.Error("Error: Please supply proper values");
			}

			if(!Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId()}) || !Classes.findOne({"_id": classData.classId, "assessmentTypes.typeName": classData.assessmentTypeToDelete.typeName})){
				throw new Meteor.Error("Error: Failed to add assessment")
			}

			Classes.update({"_id": classData.classId, "authorId": Meteor.userId()}, {$pull: {"assessmentTypes": classData.assessmentTypeToDelete}});
		}
	},
	changeAssessmentTypeName: function(classData){
		if(Meteor.isServer){
			//Properties:
				// classId
				// previousAssessmentTypeName
				// newAssessmentTypeName
			if(!Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId(), "assessmentTypes.typeName": classData.previousAssessmentTypeName})){
				throw new Meteor.Error("Error: Failed to change assessment name")
			}

			if(!classData.newAssessmentTypeName || !classData.previousAssessmentTypeName){
				throw new Meteor.Error("Error: Please supply a name");
			}

			Classes.update({"_id": classData.classId, "authorId": Meteor.userId(), "assessmentTypes.typeName": classData.previousAssessmentTypeName}, {$set: {"assessmentTypes.$.typeName": classData.newAssessmentTypeName}});
		}
	},
	changeAssessmentTypeCategory: function(classData){
		if(Meteor.isServer){
			//Properties:
				// classId
				// previousAssessmentTypeName
				// newAssessmentTypeName
			if(!Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId(), "assessmentTypes.typeName": classData.assessmentTypeName})){
				throw new Meteor.Error("Error: Failed to change assessment category")
			}

			if(!classData.newAssessmentTypeCategories){
				throw new Meteor.Error("Error: Please supply the categories");
			}

			Classes.update({"_id": classData.classId, "authorId": Meteor.userId(), "assessmentTypes.typeName": classData.assessmentTypeName}, {$set: {"assessmentTypes.$.categories": classData.newAssessmentTypeCategories}});
		}
	},
	changeAssessmentTypeWeighting: function(classData){
		if(Meteor.isServer){
			// classId
			// assessmentTypeName
			if(!Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId(), "assessmentTypes.typeName": classData.assessmentTypeName})){
				throw new Meteor.Error("Error: Failed to change assessment weighting")
			}

			if(!classData.newAssessmentTypeWeighting || !classData.assessmentTypeName){
				throw new Meteor.Error("Error: Please supply a name");
			}

			Classes.update({"_id": classData.classId, "authorId": Meteor.userId(), "assessmentTypes.typeName": classData.assessmentTypeName}, {$set: {"assessmentTypes.$.weight": classData.newAssessmentTypeWeighting}});

		}
	},
	changeClassCategoryWeighting: function(classData){
		if(Meteor.isServer){
			var userClass = Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId()});

			if(!userClass){
				throw new Meteor.Error("Error: Failed to change category weighting")
			}

			if(!classData.categoryName || !classData.categoryWeightToChange){
				throw new Meteor.Error("Error: Failed to change category weighting");
			}

			var categoryIndex = userClass.categories.indexOf(classData.categoryName);
			if(categoryIndex == -1){
				throw new Meteor.Error("Error: Failed to change category weighting")
			}

			userClass.categoryWeightings[categoryIndex] = classData.categoryWeightToChange;

			Classes.update({"_id": classData.classId, "authorId": Meteor.userId(), "categories": classData.categoryName}, {$set: {"categoryWeightings": userClass.categoryWeightings}});
		}
	},
	deleteClass: function(classData){
		if(Meteor.isServer){
			var userClass = Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId()});
			if(!userClass){
				throw new Meteor.Error("Error: Failed to delete class")
			}else{
				Classes.remove({"_id": userClass._id, "authorId": Meteor.userId()});
				Assessments.remove({"parentClassIdId": userClass._id, "authorId": Meteor.userId()});
			}
		}
	}
})