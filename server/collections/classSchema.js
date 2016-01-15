if(Meteor.isServer){
    var Schema = {};

    Schema.Classes = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: false
        },
        authorId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            optional: true
        },
        title: {
            type: String,
            optional: false
        },
        courseCode: {
            type: String,
            optional: true
        },
        assessments: {
            type: [String],
            defaultValue: [],
            regEx: SimpleSchema.RegEx.Id,
            optional: true
        },
        categories: {
            type: String,
            optional: true
        },
        categoryWeightings: {
            type: [Number],
            defaultValue: [],
            optional: true
        },
        assessmentType: {
            type: [String],
            defaultValue: [],
            optional: true
        },
        assessmentWeight: {
            type: [Number],
            defaultValue: [],
            optional: true
        }
    })

    Classes.attachSchema(Schema.Classes);
}