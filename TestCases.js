

// ** IMPLIMENTATION EXAMPLE ** // 

// Does not use global namespace -- will not recieve messages from other modules, vice versa.

var module1 = Module({
    name: 'moduleNumber1',
    global: false,
    userId: 9
},[
    function getUserId(state, events){
        return ( state.userId !== 'undefined' && state.userId !== null ) ? state.userId : 0;
    },
    function getAllData(state, events){
        return this;
    },
    function(state, events){

        events.subscribe('module2time', function(payload){
            console.log('This is private module 1 listening for module 2 ->')
            console.log(payload);
        });

        // Testing publishing a message
        events.publish('module1', "TONS OF AWESOME DATA1");
    }
]);

var module2 = Module({global: true});

var module3 = Module({global: true});

module2.extend([
    function addedLater1(){
        console.log('1');
    },
    function getUserId(state, events){
        console.log(state, events)
    },
    function(state, events){
        events.subscribe('module1', function(payload){
            console.log('Listening for a message from a private module. This should never work.')
            console.log(payload);
        });
        events.subscribe('module2time', function(payload){
            console.log('This is module 2 listening to module 2->')
            console.log(payload);
        });
    },
    function(state, events){
        var time = 0;
        var newtime = setInterval(function(){
            time = time + 3;
            events.publish('module2time', time + " seconds");
            if(time > 15) clearInterval(newtime);
        }, 3000);
    }
]);

module3.extend([
    function(state, events){
        events.subscribe('module2time', function(payload){
            console.log('This is module 3 listening to module 2 ->')
            console.log(payload);
        });
    }
]);

module1.extend([
    function(state, events){
        events.subscribe('module1', function(payload){
            console.log(payload);
            state.payTest = payload;
        });
    },
    function(state, events){
        events.publish('module1', "TONS OF AWESOME DATA1");
    },
    function(state, events){
        events.publish('module1', "TONS OF AWESOME DATA2");
    },
    function(state, events){
        var time = 0;
        var newtime = setInterval(function(){
            time = time + 3;
            //events.publish('module1', time + " seconds");
            if(time > 15) clearInterval(newtime);
        }, 3000);
    }
]);



