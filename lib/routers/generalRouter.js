Meteor.startup(function () {
    Router.configure({
        notFoundTemplate: 'notFound',
        // loadingTemplate: 'container'
    });

    loggedInUserController = RouteController.extend({
        name: 'loggedInUserController',
        waitOn: function(){
            return [Meteor.subscribe("classes"), Meteor.subscribe("assessments")]; 
        },
        onBeforeAction: function(){
            if(this.ready()){
                if(Meteor.user() !== undefined) {
                    if(Meteor.user()){
                        this.next();
                    } else{
                        Router.go("splashPage");
                    }
                }
            }
        }
    });

    Router.map(function() {
        this.route("splashPage", {
            path: "/",
            waitOn: function(){
                return [Meteor.subscribe("classes"), Meteor.subscribe("assessments")]; 
            },
            onBeforeAction: function() {
                if(this.ready()){
                    if(Meteor.user() !== undefined) {
                        if (Meteor.user()) {
                            document.title = "MarkTrackr - " + Meteor.user().profile.fullName;
                            this.render("mainView")
                        }else{
                            document.title = "Welcome to MarkTrackr!";
                            this.render("splashPage")
                        }
                    }
                }
            },
            template: "mainView"
        }),
        this.route("classPage", {
            path: "/c/:classId",
            controller: 'loggedInUserController',
            action: function(){
                var classes = Classes.findOne({"_id": this.params.classId, "authorId": Meteor.userId()});
                if(classes){
                    document.title = classes.title;
                    this.render("mainView")
                }else{
                    Router.go("splashPage")
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