if(Meteor.isServer){
	Meteor.publish("assessments", function(classId){
		return Assessments.find({"authorId": this.userId})
	})
}