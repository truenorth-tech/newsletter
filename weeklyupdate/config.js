
var EmailConfig = function (config, localInfo, mainIframe){

    var self = this;
    self.clients = ko.observableArray([]);
    self.selectedClient= ko.observable();
    self.selectedTheme= ko.observable('light');
    self.intros = ko.observableArray([]);
    self.selectedIntro= ko.observable('');
    self.customIntro = ko.observable();
    self.customIntroVisible = ko.observable(false);

    self.subjectEmail=ko.observable('Truenorth - Weekly Update');

    self.getSubject = function(project){
        currentDay = dayjs().day();
        self.monday = null;
        if(currentDay>2){
            self.now = dayjs().startOf('w').add(5, 'day');
            self.monday = dayjs().startOf('w').add(1, 'day');
        }else{
            self.now = dayjs().subtract(1, 'week').startOf('w').add(5, 'day');
            self.monday = dayjs().subtract(1, 'week').startOf('w').add(1, 'day');
        }
        return `${project}/Truenorth - Weekly Update from ${self.monday.format('MMM-Do')} to ${self.now.format('MMM-Do')}`
    }

    self.loadInfo = function () {
        ko.utils.arrayPushAll(self.clients, config.clients);
        ko.utils.arrayPushAll(self.intros, config.intros);
        ko.utils.arrayPushAll(self.thisWeek, localInfo.thisWeek);
        ko.utils.arrayPushAll(self.nextWeek, localInfo.nextWeek);
        ko.utils.arrayPushAll(self.risks, localInfo.risks);
        ko.utils.arrayPushAll(self.timeoffs, localInfo.timeoffs);


        if(localInfo.client){
            self.selectedClient( self.getClient(localInfo.client));
            self.subjectEmail( self.getSubject(self.selectedClient().name) );
        }
        if(localInfo.intro){
            self.selectedIntro( localInfo.intro);
            if(localInfo.intro=="Custom ..."){
                self.customIntro(localInfo.customIntro);
                self.customIntroVisible(true)
            }else{
                self.customIntroVisible(false)
            }
        }
        if(localInfo.theme){
            self.selectedTheme( localInfo.theme);
        }

    }

    self.clientChanged = function(){
        self.subjectEmail( self.getSubject(self.selectedClient().name) );
    }


    self.themeChanged = function(){
        console.log('theme changed', self.selectedTheme());
        console.log('current intro', self.selectedIntro());
        console.log('current this week', self.thisWeek());
    }

    self.introChanged = function(){
        console.log('current intro', self.selectedIntro());        
        if(self.selectedIntro()=="Custom ..."){
            self.customIntro(localInfo.customIntro);
            self.customIntroVisible(true)
        }else{
            self.customIntroVisible(false)
        }
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
        self.addBullet(self.timeoffs, {id:0, who:'', whenTo:'', whenFrom:''});

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

        when = '' + bullet.whenFrom + bullet.whenTo;
        who = '' + bullet.who;
        obsArray.splice(index, 1);
        if(who && who.length)
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
        return self.clients()[index];
    }


    self.openPreview= function(){

        info ={
            client: self.selectedClient(),
            theme: self.selectedTheme(),
            intro: self.selectedIntro(),
            customIntro: self.customIntro(),
            thisWeek: self.thisWeek() , 
            nextWeek: self.nextWeek(),
            risks: self.risks(),
            timeoffs: self.timeoffs(),
            emailDate: self.now.format('MMMM D, YYYY')    
        }
        localStorage.setItem('email', JSON.stringify(info));

        mainIframe.src = 'email.html?v=' + self.getRandomInt(999999)

        $('#previewModal').modal('show');

    }

    self.closePreview= function(){
        $('#previewModal').modal('hide');
    }

    self.copySubject= function(){
        navigator.clipboard.writeText(self.subjectEmail());
    }

    self.getRandomInt= function(max) {
        return Math.floor(Math.random() * max);
    }

    return self;
};