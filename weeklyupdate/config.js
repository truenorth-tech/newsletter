
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

    self.getSubject = function(projectName){
        currentDay = dayjs().day();
        self.monday = null;
        if(currentDay>2){
            self.now = dayjs().startOf('w').add(5, 'day');
            self.monday = dayjs().startOf('w').add(1, 'day');
        }else{
            self.now = dayjs().subtract(1, 'week').startOf('w').add(5, 'day');
            self.monday = dayjs().subtract(1, 'week').startOf('w').add(1, 'day');
        }
        return `${projectName}/Truenorth - Weekly Update from ${self.monday.format('MMM-Do')} to ${self.now.format('MMM-Do')}`
    }

    self.emptyProject = function () {
        return {
            thisWeek: [{ id: 0, text: '' }],
            nextWeek: [{ id: 0, text: '' }],
            risks: [],
            timeoffs: [],

            client: null,
            intro: null,
            customIntro: null
        }    
    } 

    self.project = (localInfo.currentProject) ? localInfo.projects.find( element=> element.client.name == localInfo.currentProject ) : self.emptyProject();

    self.loadProject = function(){
        self.thisWeek([]);
        ko.utils.arrayPushAll(self.thisWeek, self.project.thisWeek);
        self.thisWeek.valueHasMutated();
        self.nextWeek([]);
        ko.utils.arrayPushAll(self.nextWeek, self.project.nextWeek);
        self.nextWeek.valueHasMutated();
        self.risks([]);
        ko.utils.arrayPushAll(self.risks, self.project.risks);
        self.risks.valueHasMutated();
        self.timeoffs([]);
        ko.utils.arrayPushAll(self.timeoffs, self.project.timeoffs);
        self.timeoffs.valueHasMutated();


        if(self.project.client){
            self.selectedClient( self.getClient(self.project.client));
            self.subjectEmail( self.getSubject(self.selectedClient().name) );
        }
        if(self.project.intro){
            self.selectedIntro( self.project.intro);
            if(self.project.intro=="Custom ..."){
                self.customIntro(self.project.customIntro);
                self.customIntroVisible(true)
            }else{
                self.customIntroVisible(false)
            }
        }else{
            self.selectedIntro('');
        }
        if(self.project.theme){
            self.selectedTheme( self.project.theme);
        }else{
            self.selectedTheme('light');
        }
    }

    self.loadInfo = function () {
        ko.utils.arrayPushAll(self.clients, config.clients);
        ko.utils.arrayPushAll(self.intros, config.intros);
        
        self.loadProject();
    }

    self.clientChanged = function(){
        let project ={
            client: self.project.client || self.selectedClient(),
            theme: self.selectedTheme(),
            intro: self.selectedIntro(),
            customIntro: self.customIntro(),
            thisWeek: self.thisWeek() , 
            nextWeek: self.nextWeek(),
            risks: self.risks(),
            timeoffs: self.timeoffs(),
            emailDate: (self.now) ? self.now.format('MMMM D, YYYY') : ''    
        }

        self.saveProject(project);

        if(project.client.name != self.selectedClient().name){

            project = localInfo.projects.find(element=> element.client.name == self.selectedClient().name)
            if(project){
                self.project = project;
            }else{
                self.project = self.emptyProject();
                self.project.client = self.selectedClient();
            }
            localInfo.currentProject = self.project.client.name;
            self.loadProject(); 
        }else{
            self.subjectEmail( self.getSubject(self.selectedClient().name) );
        }
   }


    self.themeChanged = function(){
        console.log('theme changed', self.selectedTheme());
        console.log('current intro', self.selectedIntro());
        console.log('current this week', self.thisWeek());
    }

    self.introChanged = function(){
        if(self.selectedIntro()=="Custom ..."){
            self.customIntro(self.project.customIntro);
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
            if(client.name==current.name){
                index =i;
                break;
            }
        }
        return self.clients()[index];
    }

    self.saveProject=function(project){
        if( localInfo.currentProject)
        {
            index = localInfo.projects.findIndex(element=> element.client.name == localInfo.currentProject);
            if(index>=0){
                localInfo.projects[index] = project;
            }else{
                localInfo.projects.push(project)
            }
            
        }
        else
        {
            localInfo.projects = [project];
            localInfo.currentProject = project.client.name;
        }
        self.project = project;
        localStorage.setItem('emaildb', JSON.stringify(localInfo));
        
        return this.project;
    }


    self.openPreview= function(){
        const project ={
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

        self.saveProject(project);

        localStorage.setItem('email', JSON.stringify(project));

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