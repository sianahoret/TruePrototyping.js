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
    var _ancestorByCondition    = _prefix + "AncestorByCondition";
    var _ancestors              = _prefix + "Ancestors";
    var _ancestorsByCondition   = _prefix + "AncestorsByCondition";
    var _isAncestorOf           = _prefix + "IsAncestorOf";
    var _isDescendantOf         = _prefix + "IsDescendantOf";
    var _super                  = _prefix + "Super";
    var _superImmediate         = _prefix + "SuperImmediate";
    var _dependingOnSuperLevel  = _prefix + "DependingOnSuperLevel";
    var _hasProperty            = _prefix + "HasProperty";
    var _superCallStack         = _prefix + "SuperCallStack";
    
    var _errors = {
      missingPropertyName: "Property name should be specified!",
      missingMethodName:   "Method name should be specified!",
      missingOrInvalidPredicate: "Predicate should be specified and it should be a function!"
    };
    
    var firstArgumentShouldBePresent = function(checkedArgs, errorText){
      if(!checkedArgs.length){
        throw errorText;
      }
    };
    
    var firstArgumentShouldBe = function(checkedArgs, requiredTypeName, errorText){
      firstArgumentShouldBePresent(checkedArgs, errorText);
      
      var checkType = function(obj){
        switch(requiredTypeName){
          case 'string': 
            return (typeof obj == "string") || (obj.constructor == String);
          default:
            return (typeof obj == requiredTypeName);
        };
      };
      
      if(!checkType(checkedArgs[0], requiredTypeName)) {
        throw errorText;
      }
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
          for(var p in properties){
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
    
    /** AncestorByCondition
    Returns the nearest ancestor, on which predicate is evaluated to true.
    */
    Object.defineProperty(Object.prototype, _ancestorByCondition, {
      enumerable: false,
      configurable: true,
      value: function(predicate){
        firstArgumentShouldBe(arguments, 'function', _errors.missingOrInvalidPredicate);

        return this[_ancestors].reduce(function(res, curAncestor){
          return res || (predicate(curAncestor) ? curAncestor : null);
        }, null);
      }
    });
    
    /** AncestorsByCondition
    Returns aray of ancestors, on which predicate is evaluated to true.
    */
    Object.defineProperty(Object.prototype, _ancestorsByCondition, {
      enumerable: false,
      configurable: true,
      value: function(predicate){
        firstArgumentShouldBe(arguments, 'function', _errors.missingOrInvalidPredicate);

        return this[_ancestors].filter(function(curAncestor){
          return predicate(curAncestor);
        });
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
    
    /** HasProperty
    Returns a boolean indicating whether an object has the specified property (either own or inherited).
    */
    Object.defineProperty(Object.prototype, _hasProperty, {
      enumerable: false,
      configurable: true,
      value: function(propName){
        firstArgumentShouldBePresent(arguments, _errors.missingPropertyName);
        return propName in this;
      }
    });
    
    // I could add 'last' method just into Array.prototype, but it is not the aim of this library, at least for now ;)
    var EnhancedArray = Array.prototype[_derive]({
      last: function(obj){
        return this.length > 0 ? this[this.length-1] : null;
      }
    });
    
    var initSuperCallStack = function(obj){
      if(obj.hasOwnProperty(_superCallStack)) { 
        return; // already has been initialized
      }
      
      Object.defineProperty(obj, _superCallStack, {
        enumerable: false,
        configurable: true,
        value: EnhancedArray[_derive]()
      });
    };
    
    var superTemplateImpl = function(ancestorPredicateFactory){
      return function(){ /* methodName, *methodArgs */
        firstArgumentShouldBePresent(arguments, _errors.missingMethodName);

        var args = Array.prototype.slice.call(arguments);
        var methodName = args.shift();
      
        var res;
        
        // this[_superCallStack] member is intended to prevent cyclic call of the same implementation of methodName 
        // in case of recursion (if call of this.tpSuper() is encountered inside a base implementation of the method has been called with tpSuper()).
        initSuperCallStack(this);
        
        var methodOwner = (this[_superCallStack].last() || this)[_ancestorByCondition]( ancestorPredicateFactory(methodName, this) );
      
        if(methodOwner){
          this[_superCallStack].push(methodOwner);
          res = methodOwner[methodName].apply(this, args); // here recursion is possible
          this[_superCallStack].pop();
        }
      
        return res; // will return undefined, unless this.propOwner[methodName] was called, what is intended
      }
    };
    
    /** Super
    This is a short way to call on 'this' object the nearest (amoung ancestors) different implementation of the specified method (true super).
    */
    Object.defineProperty(Object.prototype, _super, {
      enumerable: false,
      configurable: true,
      value: superTemplateImpl(function(methodName, self){
        return function(theAncestor){
          return theAncestor.hasOwnProperty(methodName) && (typeof theAncestor[methodName] == "function") 
            && (theAncestor[methodName] != self[methodName]);
        };
      })
    });

    /** SuperImmediate
    This is a short way to call immediate ancestor's implementation of the specified method on 'this' object.
    */
    Object.defineProperty(Object.prototype, _superImmediate, {
      enumerable: false,
      configurable: true,
      value: superTemplateImpl(function(methodName){
        return function(theAncestor){
          return theAncestor[_hasProperty](methodName) && (typeof theAncestor[methodName] == "function");
        };
      })
    });
    
    /** DependingOnSuperLevel
    Returns outOfRecursionValue, being called quite out or at the first level of super recursion. Returns inRecursionValue, being called inside super recursion (on any level more than the first one).
    */
    Object.defineProperty(Object.prototype, _dependingOnSuperLevel, {
      enumerable: false,
      configurable: true,
      value: function(outOfRecursionValue, inRecursionValue){
        //return this.superDepth ? inRecursionValue : outOfRecursionValue;
        return (this[_superCallStack] && this[_superCallStack].length) ? inRecursionValue : outOfRecursionValue;
      }
    });



    // TODO:
    // Fallback for ES3-only-compliant environment. Is it needed???
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
    //   And so on...
    //
    // }
  };
  
  init();

})();