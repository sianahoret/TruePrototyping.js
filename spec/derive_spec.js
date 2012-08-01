describeProperty('derive', function() {
  shouldBeDefinedOnAnyObject();

  it("Should return an object, whose actual prototype is the respondent object", function(){
    expect(Object.getPrototypeOf(Serg)).toBe(Employee);
  });

  it("Should assign all passed properties to a returned object", function(){
    var john = Person.derive({
      name: "John",
      age: 30
    });
    expect(john.name).toEqual("John");
    expect(john.age).toEqual(30);
  });

});
