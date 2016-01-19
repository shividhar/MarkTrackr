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

		    Assessments.insert(fields)
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
    changeAssessmentType: function(assessmentData){
    	if(Meteor.isServer){
    		//Data:
    			//Assessment id [String]
    			//Assessment parent class ID [String]
    			//Assessment new type (Must match ones from class) [String]

    		//Specification:
    			//Changes the assessment type that the user has preset when creating the class. The assessment is outfitted with a new type name and a new weight is automatically set
    		//Login Control
	    	if (!Meteor.userId()) {
		      throw new Meteor.Error("Please login to do that.");
		    }
		    var assessment = Assessments.findOne({"_id": assessmentData.assessmentId, "authorId": Meteor.userId()});
		    if(!assessment){
		    	throw new Meteor.Error("Error: Assessment not found")
		    }

		    if(!assessmentData.newAssessmentCategoryPercentages){
		    	throw new Meteor.Error("Error: You need to pass in your marks")
		    }

		    if(!Classes.findOne({"_id": assessment.parentClassId, "authorId": Meteor.userId(), "assessmentTypes.typeName": assessmentData.newAssessmentType})){
		    	throw new Meteor.Error("Error: Failed to change assessment types")
		    }

		    Assessments.update({"_id": assessmentData.assessmentId}, {$set: {"type": assessmentData.newAssessmentType, "categoryPercentages": assessmentData.newAssessmentCategoryPercentages}})
    	}
    },
    changeAssessmentCategoryPercentages: function(assessmentData){
    	if(Meteor.isServer){
    		//Data:
    			//Assessment ID [String]
    			//Assessment new category percentages (Marks in all categories) [Array of floats]
    		//Login Control
	    	if (!Meteor.userId()) {
		      throw new Meteor.Error("Please login to do that.");
		    }
		    var assessment = Assessments.findOne({"_id": assessmentData.assessmentId, "authorId": Meteor.userId()});
		    if(!assessment){
		    	throw new Meteor.Error("Error: Failed to change assessment mark")
		    }

		    if(!assessmentData.newCategoryPercentages){
		    	throw new Meteor.Error("Error: Failed to create class");
		    }
		    if(assessmentData.newCategoryPercentages == [] ){
		    	throw new Meteor.Error("Error: Failed to create class");
		    }

		    Assessments.update({"_id": assessmentData.assessmentId}, {$set: {"categoryPercentages": assessmentData.newCategoryPercentages}})
    	}
    }
})