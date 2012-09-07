;(function(){

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

  /** derive
  This is a syntactic sugar over ES5 Object.create.
  You can create an object with Object.create immediately, if you like that way, all properties and methods defined below will still work.
  */
  Object.defineProperty(Object.prototype, "derive", {
    value: function(properties){
      var newObject = Object.create(this);
      if(properties && typeof(properties)==="object"){
        for(p in properties){
          if(properties.hasOwnProperty(p)){
            newObject[p] = properties[p];
          }
        }
      }
      return newObject;
    },
    enumerable: false
  });

  /** ancestor
  This is a syntactic sugar over ES5 Object.getPrototypeOf.
  */
  Object.defineProperty(Object.prototype, "ancestor", {
    get: function(){ return Object.getPrototypeOf(this); },
    enumerable: false
  });

  /** super
  This is a short way to call ancestor's method on 'this' object.
  */
  Object.defineProperty(Object.prototype, "super", {
    value: function(){ /* methodName, *methodArgs */
      var args = Array.prototype.slice.call(arguments);
      var methodName = args.shift();
      return this.ancestor[methodName].apply(this, args);
    },
    enumerable: false
  });

  /** ancestors
  Array of ancestors, where first element is a nearest ancestor.
  */
  Object.defineProperty(Object.prototype, "ancestors", {
    get: function(){
      return this.ancestor ? [this.ancestor].concat(this.ancestor.ancestors) : [];
    },
    enumerable: false
  });

  /** isAncestorOf
  Returns true, if this is one of the passed object's ancestors.
  */
  Object.defineProperty(Object.prototype, "isAncestorOf", {
    value: function(obj){
      return this.isPrototypeOf(obj);
    },
    enumerable: false
  });

  /** isDescendantOf
  Returns true, if the passed object is in prototype chain of this.
  */
  Object.defineProperty(Object.prototype, "isDescendantOf", {
    value: function(obj){
      return obj.isPrototypeOf(this);
    },
    enumerable: false
  });


})();