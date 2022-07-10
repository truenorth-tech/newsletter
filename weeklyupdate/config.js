var EmailConfig = function (config, localInfo){
    var self = this;
    self.clients = ko.observableArray([]);
    self.selectedClient= ko.observable();
    self.selectedTheme= ko.observable('light');
    self.intros = ko.observableArray([]);
    self.selectedIntro= ko.observable('');

    self.loadInfo = function () {
        ko.utils.arrayPushAll(self.clients, config.clients);
        ko.utils.arrayPushAll(self.intros, config.intros);
        ko.utils.arrayPushAll(self.thisWeek, localInfo.thisWeek);
        ko.utils.arrayPushAll(self.nextWeek, localInfo.nextWeek);
        ko.utils.arrayPushAll(self.risks, localInfo.risks);
        ko.utils.arrayPushAll(self.timeoffs, localInfo.timeoffs);
        if(localInfo.client){
            self.selectedClient( self.getClient(localInfo.client));
        }
        if(localInfo.intro){
            self.selectedIntro( localInfo.intro);
        }
        if(localInfo.theme){
            self.selectedTheme( localInfo.theme);
        }

    }

    self.clientChanged = function(){
        console.log('client changed', self.selectedClient());

    }
    self.themeChanged = function(){
        console.log('theme changed', self.selectedTheme());
        console.log('current intro', self.selectedIntro());
        console.log('current this week', self.thisWeek());
    }


    self.addBullet = function(obsArray, newItem){
        var len = obsArray().length;
        var max = -1;
        for( var i=0; i<len; i++){
            var current = obsArray()[i];
            if(current.id>max){
                max=current.id; 
            }
        }
        newItem = newItem || {id:0, text:''}
        newItem.id= max+1;        
        obsArray.push( newItem);
    }

    self.bulletChanged = function(obsArray, bullet){
        var len = obsArray().length;
        var index = 0;
        for( var i=0; i<len; i++){
            var current = obsArray()[i];
            if(bullet.id==current.id){
                index =i;
                break;
            }
        } 
        text = '' + bullet.text;
        obsArray.splice(index, 1);
        if(text && text.length)
            obsArray.splice(index, 0, bullet);
    }

    self.thisWeek = ko.observableArray([]);
    self.nextWeek = ko.observableArray([]);
    self.risks    = ko.observableArray([]);

    self.addThisWeek = function(){
        self.addBullet(self.thisWeek);
    }

    self.thisWeekChanged = function(bullet){
        self.bulletChanged(self.thisWeek, bullet);
    }

    self.addNextWeek = function(){
        self.addBullet(self.nextWeek);
    }

    self.nextWeekChanged = function(bullet){
        self.bulletChanged(self.nextWeek, bullet);
    }

    self.addRisk = function(){
        self.addBullet(self.risks);
    }

    self.risksChanged = function(bullet){
        self.bulletChanged(self.risks, bullet);
    }

    self.timeoffs = ko.observableArray([]);
  
    self.addTimeoff= function(){
        self.addBullet(self.timeoffs, {id:0, who:'', when:''});
    }

    self.timeoffChanged = function(obsArray, bullet){
        var len = obsArray().length;
        var index = 0;
        for( var i=0; i<len; i++){
            var current = obsArray()[i];
            if(bullet.id==current.id){
                index =i;
            }
        }        
        when = '' + bullet.when;
        who = '' + bullet.who;
        obsArray.splice(index, 1);
        if((when && when.length) || (who && who.length) )
            obsArray.splice(index, 0, bullet);
    }

    self.timeoffWhenChanged= function(bullet){
        self.timeoffChanged(self.timeoffs, bullet);
    }
    self.timeoffWhoChanged= function(bullet){
        self.timeoffChanged(self.timeoffs, bullet);
    }

    self.getClient = function(client){
        var len = self.clients().length;
        var index = 0;
        for( var i=0; i<len; i++){
            var current = self.clients()[i];
            console.log(current);
            if(client.name==current.name){
                index =i;
                break;
            }
        }

        console.log(index);
        console.log(self.clients()[index]);
        return self.clients()[index];
    }


    self.openPreview= function(){
        info ={
            client: self.selectedClient(),
            theme: self.selectedTheme(),
            intro: self.selectedIntro(),
            thisWeek: self.thisWeek(), 
            nextWeek: self.nextWeek(),
            risks: self.risks(),
            timeoffs: self.timeoffs()     
        }
        localStorage.setItem('email', JSON.stringify(info));
        localStorage.setItem('savedEmail', JSON.stringify(info));
        
        window.open( 'email.html', '_blank');
    }



    return self;
};