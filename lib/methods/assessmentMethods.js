Meteor.methods({
    createAssessment: function(assessmentData){
    	if(Meteor.isServer){
    		//Data:
    			//Assessment Title [String]
    			//Assessment Parent Class Id [String]
    			//Assessment Type (Must match ones from class) [String]
    			//Assessment Weight [Number]
    			//Assessment Categories [Array of strings]
    			//Assessment Percentages (Mark user got) [Array of numbers]
	    	//Login Control
	    	if (!Meteor.user()) {
		      throw new Meteor.Error("Please login to do that.");
		    }
		    if(!Classes.findOne({ "_id": assessmentData.parentClassId, "authorId": Meteor.userId()}) || !Classes.findOne({"_id": assessmentData.parentClassId, "assessmentTypes.typeName": assessmentData.type})){
		    	throw new Meteor.Error("Unauthorized Access");
		    }
		    if(Assessments.findOne({"authorId": Meteor.userId(), "parentClassId": assessmentData.parentClassId, "title": assessmentData.title})){
		    	throw new Meteor.Error("Error: Assessment already exists")
		    }
		    if(!assessmentData.title || !assessmentData.parentClassId || !assessmentData.type || !assessmentData.categoryPercentages){
		    	throw new Meteor.Error("Error: Failed to create class");
		    }
		    if(assessmentData.title == "" ){
		    	throw new Meteor.Error("Error: Failed to create class");
		    }

		    var fields = {
		    	"createdAt": new Date(),
		    	"authorId": Meteor.userId(),
		    	"parentClassId": assessmentData.parentClassId,
		    	"title": assessmentData.title,
		    	"type": assessmentData.type,
		    	"categoryPercentages": assessmentData.categoryPercentages
		    }

		    var assessmentId = Assessments.insert(fields)

		    Classes.update({"_id": assessmentData.parentClassId, "authorId": Meteor.userId()}, {$push: {"assessments": assessmentId}})
		}
    },
    changeAssessmentTitle: function(assessmentData){
    	if(Meteor.isServer){
    		//Data:
    			//Assessment Id [String]
    			//Assessment new title [String]
    		//Login Control
	    	if (!Meteor.userId()) {
		      throw new Meteor.Error("Please login to do that.");
		    }

		    if(!Assessments.findOne({"_id": assessmentData.assessmentId, "authorId": Meteor.userId()})){
		    	throw new Meteor.Error("Error: Failed to change title")
		    }

		    if(Assessments.findOne({"_id": assessmentData.assessmentId, "title": assessmentData.newTitle})){
		    	throw new Meteor.Error("Error: Assessment already exists")
		    }

		    if(!assessmentData.newTitle || assessmentData.newTitle == ""){
		    	throw new Meteor.Error("Error: Failed to create assesment");
		    }

		    Assessments.update({"_id": assessmentData.assessmentId}, {$set: {"title": assessmentData.newTitle}})
    	}
    },
    updateAssessment: function(assessmentData){
    	if(Meteor.isServer){
    		//Login Control
	    	if (!Meteor.userId()) {
		      throw new Meteor.Error("Please login to do that.");
		    }
		    var assessment = Assessments.findOne({"_id": assessmentData.assessmentId, "authorId": Meteor.userId()});
		    if(!assessment){
		    	throw new Meteor.Error("Error: Assessment not found")
		    }

		    if(!assessmentData.updatedAssessment){
		    	throw new Meteor.Error("Error: You need to pass in your marks")
		    }

		    if(!Classes.findOne({"_id": assessment.parentClassId, "authorId": Meteor.userId(), "assessmentTypes.typeName": assessmentData.updatedAssessment.type})){
		    	throw new Meteor.Error("Error: Failed to change assessment types")
		    }

		    Assessments.update({"_id": assessmentData.assessmentId}, {$set: {"type": assessmentData.updatedAssessment.type, "categoryPercentages": assessmentData.updatedAssessment.categoryPercentages}})
    	}
    },
    deleteAssessment: function(assessmentData){
    	if(Meteor.isServer){
    		if (!Meteor.userId()) {
		      throw new Meteor.Error("Please login to do that.");
		    }
		    if(!Assessments.findOne({"_id": assessmentData.assessmentId, "authorId": Meteor.userId()})){
		    	throw new Meteor.Error("Error: Failed to delete assessment")
		    }

		    Assessments.remove({"_id": assessmentData.assessmentId, "authorId": Meteor.userId()})
    	}
    }
})