;(function(){
  
  TruePrototyping = {
    usePrefix: function(newPrefix){
      this.prefix = newPrefix;
      init();
    }
  };
  
  var init = function(){
    
    var _prefix               = TruePrototyping.prefix || 'tp';
    var _derive               = _prefix + "Derive";
    var _ancestor             = _prefix + "Ancestor";
    var _ancestors            = _prefix + "Ancestors";
    var _isAncestorOf         = _prefix + "IsAncestorOf";
    var _isDescendantOf       = _prefix + "IsDescendantOf";
    var _super                = _prefix + "Super";
    var _superImmediate       = _prefix + "SuperImmediate";
    var _superDependentValue  = _prefix + "SuperDependentValue";

    /** Derive
    This is a syntactical sugar over ES5 Object.create.
    You can create an object with Object.create immediately, if you like that way, all properties and methods defined below will still work.
    */
    Object.defineProperty(Object.prototype, _derive, {
      enumerable: false,
      configurable: true,
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
      }
    });

    /** Ancestor
    This is a syntactic sugar over ES5 Object.getPrototypeOf.
    */
    Object.defineProperty(Object.prototype, _ancestor, {
      enumerable: false,
      configurable: true,
      get: function(){ return Object.getPrototypeOf(this); }
    });
    
    /** Ancestors
    Array of ancestors, where first element is a nearest ancestor.
    */
    Object.defineProperty(Object.prototype, _ancestors, {
      enumerable: false,
      configurable: true,
      get: function(){
        var immediateAncestor = this[_ancestor];
        return immediateAncestor ? [ immediateAncestor ].concat(immediateAncestor[_ancestors]) : [];
      }
    });

    /** IsAncestorOf
    Returns true, if this is one of the passed object's ancestors.
    */
    Object.defineProperty(Object.prototype, _isAncestorOf, {
      enumerable: false,
      configurable: true,
      value: function(obj){
        return this.isPrototypeOf(obj);
      }
    });

    /** IsDescendantOf
    Returns true, if the passed object is in prototype chain of this.
    */
    Object.defineProperty(Object.prototype, _isDescendantOf, {
      enumerable: false,
      configurable: true,
      value: function(obj){
        return obj.isPrototypeOf(this);
      }
    });
    
    // A few 'private' functions (just to remove duplication, they are not needed outside)
    var incrementSuperDepth = function(obj){
      obj.superDepth ? (obj.superDepth += 1) : (obj.superDepth = 1);
    };
    var decrementSuperDepth = function(obj){
      obj.superDepth ? (obj.superDepth += 1) : (obj.superDepth = 1);
    };
    var getNextSuperOwner = function(obj){
      obj.methodOwner = obj.methodOwner ? obj.methodOwner[_ancestor] : obj[_ancestor];
    };
    var clearSuperOwner = function(obj){
      delete this.methodOwner;
    };
    
    /** Super
    This is a short way to call on 'this' object the nearest (amoung ancestors) different implementation of the specified method (true super).
    */
    Object.defineProperty(Object.prototype, _super, {
      enumerable: false,
      configurable: true,
      value: function(){ /* methodName, *methodArgs */
        var args = Array.prototype.slice.call(arguments);
        var methodName = args.shift();
        
        var res;
        
        // this.methodOwner is introduced to prevent cyclic call of the same implementation of methodName
        // in case of recursion (if this.tpSuper() call is encountered inside a base implementation).
        getNextSuperOwner(this);
        
        while(this.methodOwner){ // look for ancestor having different implementation
          if(this.methodOwner.hasOwnProperty(methodName) && (this.methodOwner[methodName] != this[methodName])){
            incrementSuperDepth(this);
            res = this.methodOwner[methodName].apply(this, args);
            break;  
          } else {
            getNextSuperOwner(this);
          }
        }
        
        decrementSuperDepth(this);
        clearSuperOwner(this); // possible recursion is completed, forget about it
        return res; // will return undefined, unless this.methodOwner[methodName] was called, what is intended
      }
    });

    /** SuperImmediate
    This is a short way to call immediate ancestor's implementation of the specified method on 'this' object.
    */
    Object.defineProperty(Object.prototype, _superImmediate, {
      enumerable: false,
      configurable: true,
      value: function(){ /* methodName, *methodArgs */
        var args = Array.prototype.slice.call(arguments);
        var methodName = args.shift();

        var res;
        
        // this.methodOwner is introduced to prevent cyclic call of the same implementation of methodName
        // in case of recursion (if this.tpSuper() call is encountered inside a base implementation).
        getNextSuperOwner(this);
        
        if(this.methodOwner && this.methodOwner[methodName]){
          this.superDepth ? (this.superDepth += 1) : (this.superDepth = 1);
          res = this.methodOwner[methodName].apply(this, args); // here recursion is possible
        }
        
        this.superDepth ? (this.superDepth -= 1) : (delete this.superDepth);
        clearSuperOwner(this); // possible recursion is completed, forget about it
        return res; // will return undefined, unless this.methodOwner[methodName] was called, what is intended
      }
    });
    
    Object.defineProperty(Object.prototype, _superDependentValue, {
      enumerable: false,
      configurable: true,
      value: function(outOfRecursionValue, inRecursionValue){
        return this.superDepth ? inRecursionValue : outOfRecursionValue;
      }
    });



    // TODO:
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
  };
  
  init();

})();