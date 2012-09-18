describeProperty("tpAncestor", function() {
  shouldBeDefinedOnAnyObject();

  describe("Should point to the actual object's prototype", function(){

    describe("when the object has been created with 'derive' method -", function(){
      it("to the object which 'derive' was called on", function(){
        var Person = {};
        var Serg = Person.tpDerive();
        expect(Serg.tpAncestor).toBe(Person);
      });
    });

    describe("when the object has been created traditionally", function(){
      it("with 'new' operator - to the [Function-constructor].prototype", function(){
        expect(objectCreatedByFunction.tpAncestor).toBe(Number.prototype);
      });

      it("with object literal - to the Object.prototype", function(){
        expect(objectCreatedByLiteral.tpAncestor).toBe(Object.prototype);
      });
    });
    
    describe("should be null", function(){
      it("on the Object.prototype (the root of any hierarchy)", function(){
        expect(Object.prototype.tpAncestor).toBeNull();
      });
    });

  });

});

describeProperty("tpAncestors", function() {

  shouldBeDefinedOnAnyObject();

  describe("Should return an array of all ancestors, ordered by nearness (first element is the nearest ancestor)", function(){

    it("when the object has been created with 'derive' method", function(){
      expect(Serg.tpAncestors).toEqual([Employee, Person, Object.prototype]);
    });

    describe("when the object has been created traditionally", function(){
      it("with 'new' operator", function(){
        expect(objectCreatedByFunction.tpAncestors).toEqual([Number.prototype, Object.prototype]);
      });
    
      it("with object literal", function(){
        expect(objectCreatedByLiteral.tpAncestors).toEqual([Object.prototype]);
      });
    });

  });
  
  describe("should be empty", function(){
    it("on the Object.prototype (the root of any hierarchy)", function(){
      expect(Object.prototype.tpAncestors).toEqual(jasmine.any(Array));
      expect(Object.prototype.tpAncestors.length).toEqual(0);
    });
  });

});

describeProperty("tpIsAncestorOf", function() {

  shouldBeDefinedOnAnyObject();

  describe("Should return true, if for the passed object", function(){

    describe("has been created with 'derive' method", function(){
      it("the respondent object is the immediate ancestor", function(){
        expect(Employee.tpIsAncestorOf(Serg)).toBeTruthy();
      });

      it("the respondent object is a far ancestor", function(){
        expect(Person.tpIsAncestorOf(Serg)).toBeTruthy();
      });
    });

    describe("has been created traditionally", function(){
      describe("with 'new' operator", function(){
        it("the respondent object is the immediate ancestor (that is [Function-constructor].prototype)", function(){
          expect(Number.prototype.tpIsAncestorOf(objectCreatedByFunction)).toBeTruthy();
        });

        it("the respondent object is a far ancestor (that is Object.prototype)", function(){
          expect(Object.prototype.tpIsAncestorOf(objectCreatedByFunction)).toBeTruthy();
        });
      });

      describe("with object literal", function(){
        it("the respondent object is the sole ancestor (that is Object.prototype)", function(){
          expect(Object.prototype.tpIsAncestorOf(objectCreatedByLiteral)).toBeTruthy();
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
        expect(Serg.tpIsDescendantOf(Employee)).toBeTruthy();
      });

      it("and the passed object is its far ancestor", function(){
        expect(Serg.tpIsDescendantOf(Person)).toBeTruthy();
      });
    });

    describe("has been created traditionally", function(){
      describe("with 'new' operator", function(){
        it("and the passed object is its immediate ancestor (that is [Function-constructor].prototype)", function(){
          expect(objectCreatedByFunction.tpIsDescendantOf(Number.prototype)).toBeTruthy();
        });

        it("and the passed object is its far ancestor (that is Object.prototype)", function(){
          expect(objectCreatedByFunction.tpIsDescendantOf(Object.prototype)).toBeTruthy();
        });
      });

      describe("with object literal", function(){
        it("and the respondent object is its sole ancestor (that is Object.prototype)", function(){
          expect(objectCreatedByLiteral.tpIsDescendantOf(Object.prototype)).toBeTruthy();
        });
      });
    });

  });
});