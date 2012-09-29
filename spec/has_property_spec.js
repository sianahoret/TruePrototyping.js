describeProperty("tpHasProperty", function() {
  shouldBeDefinedOnAnyObject();
  
  beforeEach(function(){
    Person = {
      health: 'middle'
    };
    
    Object.defineProperty(Person, 'appearance', {
      value: 'nice',
      enumerable: false
    });
  
    Englishman = Person.tpDerive();
    
    Musician = Englishman.tpDerive();
  
    john = Musician.tpDerive({
      health: 'great'
    });
  });
  
  shouldCheckFirstArgument("property name", "Property name should be specified!");
  
  describe("Should return true, if", function(){  
    describe("the respondent object has own specified property", function(){
      it("and the property value is not null and is not undefined", function(){
        expect(john.tpHasProperty('health')).toBe(true);
      });
      
      it("on primitive type (unlike 'in' operator, which throws an error)", function(){
        var color = "red"; // string literal
        expect(color.tpHasProperty("length")).toBe(true);
        expect(function(){ "length" in color }).toThrow("invalid 'in' operand color");
      });
      
      it("and the property value is null", function(){
        john.health = null;
        expect(john.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is undefined", function(){
        john.health = void(0);
        expect(john.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property is not enumerable", function(){
        expect(john.tpHasProperty('appearance')).toBe(true);
      });
    });
    
    describe("the respondent object has inherited specified property", function(){
      it("and the property value is not null and is not undefined", function(){
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        Person.health = null;
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is undefined", function(){
        Person.health = void(0);
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property is not enumerable", function(){
        expect(john.tpHasProperty('appearance')).toBe(true);
      });
    });
  });
  
  describe("Should return false, if the respondent object does not have the specified property", function(){  
    it('neither own nor inherited', function(){
      delete Person.health;
      expect(Musician.tpHasProperty('health')).toBe(false);
    });
    
    it("on primitive type (unlike 'in' operator, which throws an error)", function(){
      var color = "red"; // string literal
      expect(color.tpHasProperty("size")).toBe(false);
      expect(function(){ "size" in color }).toThrow("invalid 'in' operand color");
    });
  });

});