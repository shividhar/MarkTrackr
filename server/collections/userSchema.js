if(Meteor.isServer){
    var Schema = {};

    Schema.UserProfile = new SimpleSchema({
        studentNumber: {
            type: Number,
            optional: true
        },
        fullName: {
            type: String,
            regEx: /^[A-Za-z]([-']?[A-Za-z]+)*( [A-Za-z]([-']?[A-Za-z]+)*)+$/,
            optional: false
        },
        firstName: {
            type: String,
            regEx: /^.{2,25}$/,
            optional: false
        },
        lastName: {
            type: String,
            regEx: /^.{1,25}$/,
            optional: false
        },
        profileImageURL: {
            type: String,
            optional: true
        }
    })

    Schema.User = new SimpleSchema({
        createdAt: {
            type: Date,
        },
        emails: {
            type: [Object],
            // this must be optional if you also use other login services like facebook,
            // but if you use only accounts-password, then it can be required
            optional: true
        },
        "emails.$.address": {
            type: String,
            regEx: SimpleSchema.RegEx.Email
        },
        "emails.$.verified": {
            type: Boolean
        },
        profile: {
            type: Schema.UserProfile,
            optional: false
        },
        services: {
            type: Object,
            optional: true,
            blackbox: true
        },
        signupComplete: {
            type: Boolean,
            defaultValue: false,
            optional: false
        }
    });


    Meteor.users.attachSchema(Schema.User);

}