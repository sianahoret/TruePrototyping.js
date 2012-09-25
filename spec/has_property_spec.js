describeProperty("tpHasProperty", function() {
  shouldBeDefinedOnAnyObject();
  
  beforeEach(function(){
    Person = {
      health: 'middle'
    };
  
    Englishman = Person.tpDerive();
    
    Musician = Englishman.tpDerive();
  
    john = Musician.tpDerive({
      health: 'great'
    });
  });
  
  shouldCheckFirstArgument("Property name", String, "Property name should be specified and it should be a string!");
  
  describe("Should return true, if", function(){  
    describe("the respondent object has own specified prooerty", function(){
      it("and the property value is not null and is not 'undefined'", function(){
        expect(john.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        john.health = null;
        expect(john.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        john.health = void(0);
        expect(john.tpHasProperty('health')).toBe(true);
      });
    });
    
    describe("the respondent object has inherited specified property", function(){
      it("and the property value is not null and is not 'undefined'", function(){
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        Person.health = null;
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
      
      it("and the property value is null", function(){
        Person.health = void(0);
        expect(Musician.tpHasProperty('health')).toBe(true);
      });
    });
  });
  
  describe("Should return false, if the respondent object does not have the specified property", function(){  
    it('neither own nor inherited', function(){
      delete Person.health;
      expect(Musician.tpHasProperty('health')).toBe(false);
    });
  });
});