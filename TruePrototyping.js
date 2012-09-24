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
    var _hasProperty            = _prefix + "HasProperty";
    var _ancestorHaving         = _prefix + "AncestorHaving";
    var _ancestorHavingOwn      = _prefix + "AncestorHavingOwn";
    
    var _errors = {
      missingPropertyName:  "Property name should be specified and it should be a string!",
      missingMethodName:    "Method name should be specified and it should be a string!"
    };
    

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
    };
    
    /** tpHasProperty
    Returns a boolean indicating whether an object has the specified property (either own or inherited). 
    */
    Object.defineProperty(Object.prototype, _hasProperty, {
      enumerable: false,
      configurable: true,
      value: function(propName){
        if(!arguments.length || !isString(arguments[0])) { 
          throw _errors.missingPropertyName;
        }
        var test = function(obj){ return obj.hasOwnProperty(propName); };
        return (test(this) || this[_ancestors].some(test));
      }
    });
    
    /** AncestorHaving
    Return an ancestor, which responds to the specified property (has it either own or inherited).
    */
    Object.defineProperty(Object.prototype, _ancestorHaving, {
      enumerable: false,
      configurable: true,
      value: function(propName){
        if(!arguments.length || !isString(arguments[0])) { 
          throw _errors.missingPropertyName;
        }
        if(this[_ancestor] && this[_ancestor][_hasProperty](propName)){
          return this[_ancestor];
        }
        // There is no sense to go up further: if the property is absent on this[_ancestor], it is absent above.
        return null;
      }
    });
    
    /** AncestorHavingOwn
    Return an ancestor, which has own specified property, and if the property is function (method) - if the function is different than 'this' object has.
    */
    Object.defineProperty(Object.prototype, _ancestorHavingOwn, {
      enumerable: false,
      configurable: true,
      value: function(propName){
        if(!arguments.length || !isString(arguments[0])) { 
          throw _errors.missingPropertyName;
        }
        
        for(var a=0; a< this[_ancestors].length; a++){
          var ancestor = this[_ancestors][a];
          if(ancestor.hasOwnProperty(propName)){
            return ancestor;
          }
        }
        return null;
        
        // this[_ancestors].reduce(function(res, curAncestor){
        //   return res || (curAncestor.hasOwnProperty(propName) ? curAncestor : null);
        // }, null);
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
          throw _errors.missingMethodName;
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
          throw _errors.missingMethodName;
        } 
        var args = Array.prototype.slice.call(arguments);
        var propName = args.shift();

        var res;
        
        // this.propOwner is introduced to prevent cyclic call of the same implementation of propName
        // in case of recursion (if this.tpSuper() call is encountered inside a base implementation).
        this.propOwner = (this.propOwner || this)[_ancestorHaving](propName);
        
        if(this.propOwner && (typeof this.propOwner[propName] == "function")){
          incrementSuperDepth(this);
          res = this.propOwner[propName].apply(this, args); // here recursion is possible
        }
        
        decrementSuperDepth(this);
        delete this.propOwner; // possible recursion is completed, forget about it
        return res; // will return undefined, unless this.propOwner[propName] was called, what is intended
      }
    });
    
    /** DependingOnSuperLevel
    Returns outOfRecursionValue, being called quite out or at the first level of super recursion. Returns inRecursionValue, being called inside super recursion (on any level more than the first one).
    */
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