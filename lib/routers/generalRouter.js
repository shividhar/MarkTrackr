Meteor.startup(function () {
    Router.configure({
        notFoundTemplate: 'notFound',
        loadingTemplate: 'container'
    });

    loggedInUserController = RouteController.extend({
        name: 'loggedInUserController',
        waitOn: function(){
            return [Meteor.subscribe("classes"), Meteor.subscribe("assessments")]; 
        },
        onBeforeAction: function(){
            if(Meteor.user() !== undefined) {
                if(Meteor.user()){
                    this.next();
                } else{
                    Router.go("splashPage");
                }
            }
        }
    });

    Router.map(function() {
        this.route("splashPage", {
            path: "/",
            controller: 'loggedInUserController',
            template: "mainView"
        }),
        this.route("classPage", {
            path: "/c/:classId",
            controller: 'loggedInUserController',
            onBeforeAction: function(){
              if(this.ready()){
                if(Classes.findOne({"_id": this.params.classId, "authorId": Meteor.userId()})){
                    this.next()
                }else{
                    Router.go("splashPage")
                }
              }  
            },
            data: function(){
              return {
                "classes": Classes.findOne({"_id": this.params.classId})
              }
            }
        })
    })
})