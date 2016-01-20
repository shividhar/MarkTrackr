if(Meteor.isServer){
	Meteor.publish("classes", function(){
		return Classes.find({"authorId": this.userId})
	})
}