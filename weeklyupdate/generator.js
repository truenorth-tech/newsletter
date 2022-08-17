var EmailGenerator = function (localInfo){
    var self = this;

    self.currentDate = ko.observable('');
    self.intro       = ko.observable('');
    self.logo        = ko.observable('');
    self.logoWidth   = ko.observable('');
    self.logoAlt     = ko.observable('');
    
    self.thisWeek = ko.observableArray([]);
    self.nextWeek = ko.observableArray([]);
    self.risks    = ko.observableArray([]);
    self.clients = ko.observableArray([]);
    self.timeoffs = ko.observableArray([]);

    self.client        = ko.observable('');
    self.intros        = ko.observableArray([]);

    self.loadInfo = function () {
        console.log(localInfo)
        self.currentDate( localInfo.emailDate);
        self.intro(localInfo.intro);
        self.logo(localInfo.client.logo);
        self.logoWidth(localInfo.client.logoWidth);
        self.logoAlt(localInfo.client.name);
        
        ko.utils.arrayPushAll(self.thisWeek, localInfo.thisWeek);
        ko.utils.arrayPushAll(self.nextWeek, localInfo.nextWeek);
        ko.utils.arrayPushAll(self.risks, localInfo.risks);
        const timeoffs = localInfo.timeoffs.map( function(item){
            console.log(dayjs(item.whenFrom))
            console.log(dayjs(item.whenTo))
            const from = dayjs(item.whenFrom).format("MMM-DD");
            const to = dayjs(item.whenTo).format("MMM-DD")
            return {text: '' + from + ' - ' + to +  ' | ' + item.who};
        });
        ko.utils.arrayPushAll(self.timeoffs, timeoffs);
        if(localInfo.client){
            self.client( localInfo.client);
        }    
    }

    self.background = function(){
        return localInfo.theme =='light' ? 
            "url('https://newsletter.truenorth.co/weeklyupdate/assets/header-light.png') no-repeat center bottom" : 
            "url('https://newsletter.truenorth.co/weeklyupdate/assets/header-dark.png') no-repeat center bottom"
    }

    self.color = function(){
        return localInfo.theme =='light' ? '#0a132c' : '#1fc4db'
    }

    return self;
};