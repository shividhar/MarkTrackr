Meteor.startup(function () {
    Router.configure({
        notFoundTemplate: 'notFound',
        loadingTemplate: 'container'
    });

    Router.map(function() {
        this.route("splashPage", {
            path: "/",
            onBeforeAction: function() {
                if(Meteor.user() !== undefined) {
                    console.log("hit")
                    if (Meteor.user()) {
                        this.render("mainView")
                    }else{
                        this.render("splashPage")
                    }
                }
            }
        }),
        this.route("playlist", {
            path: "/p/:playlistId",
            waitOn: function(){
              return Meteor.subscribe("playlist", this.params.playlistId); 
            },
            template: function() {
              if (Meteor.Device.isPhone()) {
                return "mobilePlaylistPage";
              }
              else{
                return "container";
              };
            },
            onBeforeAction: function(){
              if(this.ready()){
                var playlist = Playlists.findOne({"playlistId": this.params.playlistId});
                  if(playlist){
                    if(playlist.songList[0]){
                      Session.set("firstSongId", playlist.songList[0]);
                    }
                    document.title = "Playlist";

                    this.next();
                  }else{
                      Router.go("notFound");
                  }
              }  
            },
            data: function(){
              if (Playlists.findOne({"playlistId": this.params.playlistId})) {
                Session.set('thisPlaylistData', Playlists.findOne({"playlistId": this.params.playlistId}));
                document.title = Playlists.findOne({"playlistId": this.params.playlistId}).playlistName;
              };
              if (!Session.get('bodyTemplateWait')) {
                setTimeout(function() {
                  Session.set('bodyTemplateWait', true);
                }, 300);
                setTimeout(executeResizeFuncs, 15);
              }
              else{
                return {
                    // "playlist": Playlists.findOne({"playlistId": this.params.playlistId}),
                    "bodyTemplate": "musyncPlaylist"
                }
              };
            }
        })
    })
})