;(function(){
  
  TruePrototyping = {
    usePrefix: function(newPrefix){
      this.prefix = newPrefix;
      init();
    }
  };
  
  var init = function(){
    
    var _prefix                 = TruePrototyping.prefix || 'tp';
    var _derive                 = _prefix + "Derive";
    var _ancestor               = _prefix + "Ancestor";
    var _ancestors              = _prefix + "Ancestors";
    var _isAncestorOf           = _prefix + "IsAncestorOf";
    var _isDescendantOf         = _prefix + "IsDescendantOf";
    var _super                  = _prefix + "Super";
    var _superImmediate         = _prefix + "SuperImmediate";
    var _dependingOnSuperLevel  = _prefix + "DependingOnSuperLevel";
    var _ancestorHaving         = _prefix + "AncestorHaving";
    var _ancestorHavingOwn      = _prefix + "AncestorHavingOwn";
    

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
      get: function(){s
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
      obj.superDepth ? (obj.superDepth -= 1) : (delete obj.superDepth);
    };
    var getNextPropOwner = function(obj){
      obj.propOwner = obj.propOwner ? obj.propOwner[_ancestor] : obj[_ancestor];
    };
    var clearPropOwner = function(obj){
      delete obj.propOwner;
    };
    var isString = function(obj){
      return (typeof obj == "string") || (obj.constructor == String);
    }
    
    /** AncestorHaving
    */
    Object.defineProperty(Object.prototype, _super, {
      enumerable: false,
      configurable: true,
      value: function(propName){
      }
    });
    
    /** Super
    This is a short way to call on 'this' object the nearest (amoung ancestors) different implementation of the specified method (true super).
    */
    Object.defineProperty(Object.prototype, _super, {
      enumerable: false,
      configurable: true,
      value: function(){ /* propName, *methodArgs */
        if(!arguments.length || !isString(arguments[0])) { 
          throw "Method name should be specified and it should be a string!";
        } 
        var args = Array.prototype.slice.call(arguments);
        var propName = args.shift();
        
        var res;
        
        // this.propOwner is introduced to prevent cyclic call of the same implementation of propName
        // in case of recursion (if this.tpSuper() call is encountered inside a base implementation).
        getNextPropOwner(this);
        
        while(this.propOwner){ // look for ancestor having different implementation
          if(this.propOwner.hasOwnProperty(propName) && (typeof this.propOwner[propName] == "function") 
              && this.propOwner[propName] != this[propName]
            ){
            incrementSuperDepth(this);
            res = this.propOwner[propName].apply(this, args);
            break;  
          } else {
            getNextPropOwner(this);
          }
        }
        
        decrementSuperDepth(this);
        clearPropOwner(this); // possible recursion is completed, forget about it
        return res; // will return undefined, unless this.propOwner[propName] was called, what is intended
      }
    });

    /** SuperImmediate
    This is a short way to call immediate ancestor's implementation of the specified method on 'this' object.
    */
    Object.defineProperty(Object.prototype, _superImmediate, {
      enumerable: false,
      configurable: true,
      value: function(){ /* propName, *methodArgs */
        if(!arguments.length || !isString(arguments[0])) { 
          throw "Method name should be specified and it should be a string!";
        } 
        var args = Array.prototype.slice.call(arguments);
        var propName = args.shift();

        var res;
        
        // this.propOwner is introduced to prevent cyclic call of the same implementation of propName
        // in case of recursion (if this.tpSuper() call is encountered inside a base implementation).
        getNextPropOwner(this);
        
        if(this.propOwner && this.propOwner[propName] && (typeof this.propOwner[propName] == "function")){
          incrementSuperDepth(this);
          res = this.propOwner[propName].apply(this, args); // here recursion is possible
        }
        
        decrementSuperDepth(this);
        clearPropOwner(this); // possible recursion is completed, forget about it
        return res; // will return undefined, unless this.propOwner[propName] was called, what is intended
      }
    });
    
    Object.defineProperty(Object.prototype, _dependingOnSuperLevel, {
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