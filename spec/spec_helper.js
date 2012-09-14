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

// Just to decrease duplication
shouldBeDefinedOnAnyObject = function(){
  describe("Should be defined on any object", function(){
    it("On object created with 'derive'", function(){
      expect(Serg[_property_]).toBeDefined();
    });

    it("On Object", function(){
      expect(Object[_property_]).toBeDefined();
    });

    it("On Object.prototype", function(){
      expect(Object.prototype[_property_]).toBeDefined();
    });

    it("On object created with literal", function(){
      expect(objectCreatedByLiteral[_property_]).toBeDefined();
    });

    it("On object created with function", function(){
      expect(objectCreatedByFunction[_property_]).toBeDefined();
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

