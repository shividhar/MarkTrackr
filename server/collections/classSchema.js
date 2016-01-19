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
        assessmentTypes: {
            type: [Object],
            defaultValue: [],
            optional: false
        },
        "assessmentTypes.$.typeName": {
            type: String,
            optional: false
        },
        "assessmentTypes.$.weight": {
            type: Number,
            optional: true,
            decimal: true
        },
        "assessmentTypes.$.categories": {
            type: [String],
            defaultValue: [],
            optional: false
        },
        assessments: {
            type: [String],
            defaultValue: [],
            regEx: SimpleSchema.RegEx.Id,
            optional: true
        },
        categories: {
            type: [String],
            optional: true
        },
        categoryWeightings: {
            type: [Number],
            defaultValue: [],
            optional: true,
            decimal: true
        }
    })

    Classes.attachSchema(Schema.Classes);
}