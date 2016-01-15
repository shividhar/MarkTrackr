if(Meteor.isServer){
	Accounts.onCreateUser(function(options, user) {
		if(user.services.google.name){
			options.profile.fullName = user.services.google.name;
			options.profile.firstName = user.services.google.given_name;
			options.profile.lastName = user.services.google.family_name;
			options.profile.profileImageURL = user.services.google.picture;

			user.profile = options.profile
			return user
		}else{
			throw new Meteor.Error("Account creation failed.");
		}
	})
}