if(Meteor.isServer){
    var Schema = {};

    Schema.Assessments = new SimpleSchema({
        createdAt: {
            type: Date,
            optional: false
        },
        authorId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            optional: true
        },
        parentClassId: {
            type: String,
            regEx: SimpleSchema.RegEx.Id,
            optional: true,
        },
        title: {
            type: String,
            optional: false
        },
        assessmentWeight: {
            type: Number,
            optional: true
        },
        assessmentCategories: {
            type: [String],
            defaultValue: [],
            optional: true
        },
        assessmentCategoryDenominators: {
            type: [Number],
            defaultValue: [],
            defaultValue: []
        },
        assessmentsCategoryMarks: {
            type: [Number],
            defaultValue: [],
            defaultValue: []
        }
    })

    Assessments.attachSchema(Schema.Assessments);
}
