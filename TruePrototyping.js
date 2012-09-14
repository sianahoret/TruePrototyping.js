;(function(){
  
  TruePrototyping = {
    prefix: 'tp',
    
    usePrefix: function(newPrefix){
      this.prefix = newPrefix;
      this.init();
    },

    init: function(){

      /** derive
      This is a syntactic sugar over ES5 Object.create.
      You can create an object with Object.create immediately, if you like that way, all properties and methods defined below will still work.
      */
      Object.defineProperty(Object.prototype, TruePrototyping.prefix + "Derive", {
        value: function(properties){
          var newObject = Object.create(this);
          if(properties && typeof(properties) === "object"){
            for(p in properties){
              if(properties.hasOwnProperty(p)){
                newObject[p] = properties[p];
              }
            }
          }
          return newObject;
        },
        enumerable: false,
        configurable: true
      });

      /** ancestor
      This is a syntactic sugar over ES5 Object.getPrototypeOf.
      */
      Object.defineProperty(Object.prototype, TruePrototyping.prefix + "Ancestor", {
        get: function(){ return Object.getPrototypeOf(this); },
        enumerable: false,
        configurable: true
      });

      /** super
      This is a short way to call ancestor's method on 'this' object.
      */
      Object.defineProperty(Object.prototype, TruePrototyping.prefix + "Super", {
        value: function(){ /* methodName, *methodArgs */
          var args = Array.prototype.slice.call(arguments);
          var methodName = args.shift();
          return this[TruePrototyping.prefix + 'Ancestor'][methodName].apply(this, args);
        },
        enumerable: false,
        configurable: true
      });

      /** ancestors
      Array of ancestors, where first element is a nearest ancestor.
      */
      Object.defineProperty(Object.prototype, TruePrototyping.prefix + "Ancestors", {
        get: function(){
          return this.tpAncestor ? [ this[TruePrototyping.prefix + 'Ancestor'] ].concat(this.tpAncestor.tpAncestors) : [];
        },
        enumerable: false,
        configurable: true
      });

      /** isAncestorOf
      Returns true, if this is one of the passed object's ancestors.
      */
      Object.defineProperty(Object.prototype, TruePrototyping.prefix + "IsAncestorOf", {
        value: function(obj){
          return this.isPrototypeOf(obj);
        },
        enumerable: false,
        configurable: true
      });

      /** isDescendantOf
      Returns true, if the passed object is in prototype chain of this.
      */
      Object.defineProperty(Object.prototype, TruePrototyping.prefix + "IsDescendantOf", {
        value: function(obj){
          return obj.isPrototypeOf(this);
        },
        enumerable: false,
        configurable: true
      });



      // Fallback for ES3-compliant environment
      //
      // if(typeof Object.create === "function"){
      //   ES5 = true;
      // }
      //
      // var create;
      // var getPrototypeOf;
      //
      // if(ES5){
      //
      //   create = Object.create;
      //   getPrototypeOf = Object.getPrototypeOf;
      //
      // } else { // ES3
      //
      //   create = function(){
      //     function F() {}
      //     F.prototype = proto;
      //     newObject = new F();
      //   };
      //
      //   if ( typeof "test".__proto__ === "object" ) {
      //     getPrototypeOf = function(object){
      //       return object.__proto__;
      //     };
      //   } else {
      //     getPrototypeOf = function(object){
      //       // May break if the constructor has been tampered
      //       return object.constructor.prototype;
      //     };
      //   }
      //
      // }
    }
  };
  
  TruePrototyping.init();

})();