Meteor.methods({
    createClass: function(classData){
    	if(Meteor.isServer){
	    	//Login Control
	    	if (!Meteor.userId()) {
		      throw new Meteor.Error("Please login to do that.");
		    }
		    if(!!classData.title || !!classData.courseCode || !!classData.categories || !!classData.categoryWeightings || !!classData.assessmentTypes || !!classData.assessmentWeights){
		    	throw new Meteor.Error("Error: Failed to create class");
		    }
		    if(classData.title == "" || classData.courseCode == ""){
		    	throw new Meteor.Error("Error: Failed to create class");
		    }

		    var fields = {
		    	"createdAt": new Date(),
		    	"authorId": Meteor.userId(),
		    	"title": classData.title,
		    	// "courseCode": classData.courseCode,
		    	"categories": classData.categories,
		    	"categoryWeightings": classData.categoryWeightings,
		    	"assessmentTypes": classData.assessmentTypes,
		    	"assessmentWeights": classData.assessmentWeights
		    }

		    Classes.insert(fields)
	    },
	    changeClassTitle: function(classData){
	    	if(Meteor.isServer){
	    		if(!Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId()})){
	    			throw new Meteor.Error("Error: Failed to change class title")
	    		}

	    		if(!!classData.newTitle){
	    			throw new Meteor.Error("Error: Please supply a title");
	    		}

	    		Classes.update({"_id": classData.classId, "authorId": Meteor.userId()}, {$set: {"title": classData.newTitle}});
	    	}
	    },
	    changeClassCategoryWeighting: function(classData){
	    	if(Meteor.isServer){
	    		var userClass = Classes.findOne({"_id": classData.classId, "authorId": Meteor.userId()});

	    		if(!userClass){
	    			throw new Meteor.Error("Error: Failed to change category weighting")
	    		}

	    		if(!!classData.category || classData.changeClassCategoryWeightingToChange){
	    			throw new Meteor.Error("Error: Failed to change category weighting");
	    		}

	    		var categoryIndex = userClass.indexOf(classData.category);
	    		if(categoryIndex == -1){
	    			throw new Meteor.Error("Error: Failed to change category weighting")
	    		}

	    		userClass.categoryWeightings[categoryIndex] = classData.changeClassCategoryWeightingToChange;

	    		Classes.update({"_id": classData.classId, "authorId": Meteor.userId(), "categories": classData.category}, {$set: {"categoryWeightings": userClass.categoryWeightings}});
	    	}
	    }

	}
})