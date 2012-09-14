describeProperty("tpAncestor", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should point to the actual object's prototype", function(){

    describe("when the object has been created with 'derive' method -", function(){
      it("to the object which 'derive' was called on", function(){
        var Person = {};
        var Serg = Person.tpDerive();
        expect(Serg[_property_]).toBe(Person);
      });
    });

    describe("when the object has been created traditionally", function(){
      it("with 'new' operator - to the [Function-constructor].prototype", function(){
        expect(objectCreatedByFunction[_property_]).toBe(Number.prototype);
      });

      it("with object literal - to the Object.prototype", function(){
        expect(objectCreatedByLiteral[_property_]).toBe(Object.prototype);
      });
    });

  });

});

describeProperty("tpAncestors", function() {

  shouldBeDefinedOnAnyObject();

  describe("Should return an array of all ancestors, ordered by nearness (first element is the nearest ancestor)", function(){

    it("when the object has been created with 'derive' method", function(){
      expect(Serg[_property_]).toEqual([Employee, Person, Object.prototype]);
    });

    describe("when the object has been created traditionally", function(){
      it("with 'new' operator", function(){
        expect(objectCreatedByFunction[_property_]).toEqual([Number.prototype, Object.prototype]);
      });

      it("with object literal", function(){
        expect(objectCreatedByLiteral[_property_]).toEqual([Object.prototype]);
      });
    });

  });

});

describeProperty("tpIsAncestorOf", function() {

  shouldBeDefinedOnAnyObject();

  describe("Should return true, if for the passed object", function(){

    describe("has been created with 'derive' method", function(){
      it("the respondent object is the immediate ancestor", function(){
        expect(Employee[_property_](Serg)).toBeTruthy();
      });

      it("the respondent object is a far ancestor", function(){
        expect(Person[_property_](Serg)).toBeTruthy();
      });
    });

    describe("has been created traditionally", function(){
      describe("with 'new' operator", function(){
        it("the respondent object is the immediate ancestor (that is [Function-constructor].prototype)", function(){
          expect(Number.prototype[_property_](objectCreatedByFunction)).toBeTruthy();
        });

        it("the respondent object is a far ancestor (that is Object.prototype)", function(){
          expect(Object.prototype[_property_](objectCreatedByFunction)).toBeTruthy();
        });
      });

      describe("with object literal", function(){
        it("the respondent object is the sole ancestor (that is Object.prototype)", function(){
          expect(Object.prototype[_property_](objectCreatedByLiteral)).toBeTruthy();
        });
      });
    });

  });

});

describeProperty("tpIsDescendantOf", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should return true, if the respondent object", function(){

    describe("has been created with 'derive' method", function(){
      it("and the passed object is its immediate ancestor", function(){
        expect(Serg[_property_](Employee)).toBeTruthy();
      });

      it("and the passed object is its far ancestor", function(){
        expect(Serg[_property_](Person)).toBeTruthy();
      });
    });

    describe("has been created traditionally", function(){
      describe("with 'new' operator", function(){
        it("and the passed object is its immediate ancestor (that is [Function-constructor].prototype)", function(){
          expect(objectCreatedByFunction[_property_](Number.prototype)).toBeTruthy();
        });

        it("and the passed object is its far ancestor (that is Object.prototype)", function(){
          expect(objectCreatedByFunction[_property_](Object.prototype)).toBeTruthy();
        });
      });

      describe("with object literal", function(){
        it("and the respondent object is its sole ancestor (that is Object.prototype)", function(){
          expect(objectCreatedByLiteral[_property_](Object.prototype)).toBeTruthy();
        });
      });
    });

  });
});