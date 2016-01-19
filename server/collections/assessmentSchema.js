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
        type: {
            type: String,
            optional: true
        },
        categoryPercentages: {
            type: [Number],
            defaultValue: [],
            optional: true,
            decimal: true
        }
    })

    Assessments.attachSchema(Schema.Assessments);
}
