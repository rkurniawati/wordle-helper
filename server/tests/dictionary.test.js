import {loadDictionary} from "../modules/dictionary.js"
test("loadDictionary - defined", () => {
    expect(loadDictionary).toBeDefined()
});

test("loadDictionary - returns a promise", () => {
    expect(loadDictionary()).toBeInstanceOf(Promise)
});

test("loadDictionary - returns a promise that resolves to an array", () => {
    expect(loadDictionary()).resolves.toBeInstanceOf(Array)
});

test("loadDictionary - returns a promise that resolves to an array of strings of 5 characters", () => {
    expect(loadDictionary()).resolves.toEqual(expect.arrayContaining([expect.stringMatching(/^[a-z]{5}$/i)]))
})
