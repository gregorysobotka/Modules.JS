var mFactory = function(config, globalOverride){

    var useGlobalRouter = ( typeof config !== 'undefined' && typeof config.global !== 'undefined' && config.global !== false ),
        mRouter = {listeners: {}, modules: []};

    if(useGlobalRouter){
        /*

        */
        if( typeof window.gcr !== 'undefined' ){
            mRouter = window.gcr
        } else {
            window.gcr = mRouter;
        }   

    }

    var pubSub = {
        exists: function(name){
            return mRouter.listeners.hasOwnProperty(name);
        },
        add: function(name){
            //
            if(!pubSub.exists(name)){
                mRouter.listeners[name] = [];
            }
        },
        publish: function(name, payload){
            // 
            if(pubSub.exists(name)){
                mRouter.listeners[name].map(function(listener){
                    listener(payload);
                });
            }
        },
        subscribe: function(name, fnc){
            //
            if(!pubSub.exists(name)){
                pubSub.add(name)
            }
            mRouter.listeners[name].push(fnc);
        }
    };

    function module(overrides, moduleConfig){

        var module = this,
            publicMethods = {};

        module.state = ( typeof moduleConfig !== 'undefined' ) ? moduleConfig : {};

        publicMethods.events = {
            publish: pubSub.publish,
            subscribe: pubSub.subscribe
        };

        publicMethods.extend = function(override){

            if(typeof override === 'undefined') return;

            var overrides = (Array.isArray(override)) ? override : [override];

            overrides.map((passAlong, i) => {
                
                if(typeof passAlong.name !== 'undefined' && passAlong.name !== ''){
                    publicMethods[passAlong.name] = passAlong.bind(this, module.state, publicMethods.events);
                } else {
                    passAlong(module.state, publicMethods.events);
                }

            });

        };

        if(overrides){
            publicMethods.extend(overrides);
        }
        
        return publicMethods;

    } // End of module

    var newModule = new module(globalOverride, config);

    if(useGlobalRouter) mRouter.modules.push(newModule);


    return newModule;

};