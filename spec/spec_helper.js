// Wrapper for describe, allowing to address to the tested property uniformly (as to _property_)
describeProperty = function(propertyName, func){
  describe(propertyName, function(){
    beforeEach(function() {
      _property_ = propertyName;
    });
    afterEach(function() {
      _property_ = null;
    });
    func();
  });
};

//////////////// Shared specs ////////////////

shouldBeDefinedOnAnyObject = function(){
  describe("Should be defined on any object", function(){
    it("On Object.prototype", function(){
      expect(Object.prototype[_property_]).toBeDefined();
    });
    
    it("On object created with literal", function(){
      expect(objectCreatedByLiteral[_property_]).toBeDefined();
    });
    
    it("On Object", function(){
      expect(Object[_property_]).toBeDefined();
    });

    it("On object created with 'tpDerive'", function(){
      expect(Serg[_property_]).toBeDefined();
    });

    it("On object created with function", function(){
      expect(objectCreatedByFunction[_property_]).toBeDefined();
    });
  });
};

shouldCheckFirstArgument = function(firstArgumentComment, requiredArgumentType, exceptionText){
  describe("Should throw an exception,", function(){
    it("if the " + firstArgumentComment + " is not specified", function(){
      expect(function(){ Person[_property_]() }).toThrow(exceptionText);
    });
    
    it("if the " + firstArgumentComment + " is not a " + requiredArgumentType.name, function(){
      expect(function(){ Person[_property_](123) }).toThrow(exceptionText);
    });
  });
  
  describe("Should not throw an exception,", function(){
    it("if the " + firstArgumentComment + " is a " + requiredArgumentType.name, function(){
      expect(function(){ Person[_property_](new requiredArgumentType()) }).not.toThrow();
    });
  });
};

beforeEach(function () {
  this.addMatchers({
    toBeInstanceOf: function (expected) {
      return this.actual instanceof expected;
    }
  });
});

beforeEach(function(){
  Person = {};
  Employee = Person.tpDerive();
  Serg = Employee.tpDerive();

  objectCreatedByFunction = new Number(5);

  objectCreatedByLiteral = {};
});



