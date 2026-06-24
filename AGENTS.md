# AGENTS.md

## Scripts and commands
- Use `just` to run scripts and commands
    - Setup: `just setup`
    - Start app locally in dev mode: `just dev`
        - Start web frontend only locally in dev mode: `just frontend-dev`
    - Run tests: `just test`

## Code style
- Use the container pattern in `src/components/Container.ts` when possible for `divs`
    - Avoid using adhoc `styled` components and opt to add features to the Container builder instead.
        - If you plan on adding a new field or feature to the container builder, do not proceed until you get feedback on what you're trying to add.

- Use the controls pattern in `src/components/Controls.ts` when possible for buttons
    - Avoid using adhoc `styled` components and opt to add features to the Controls builder instead.
        - If you plan on adding a new field or feature to the controls builder, do not proceed until you get feedback on what you're trying to add.


- Avoid making one-off functions and default to doing things inline unless two conditions hold:
    - There are a bunch of complex steps and interactions in a body of code where making a function can encapsulate all correlated behavior in a simple, and often singular, concept.
        - Rule of thumb is that if a chunk of code exceeds 8 lines of code, then it should be considered to be factored into its own function.
    - There is a block of code repeated enough times such that making a function will simplify where said block of code is repeated.
        - Example: `getTotalTimePassed(events)` is really just `Max - Min`, but, it's probably easier to understand it as a function: it has a good name to encapsulate the concept and requires the programmer to not make assumptions about its behavior. This is especially true if it's called in multiple locations in the codebase.


## Testing
- If asked to write tests, there are two guiding principles to adhere to:
    - First, identify that the situation and goal of the test. This will make it easier to cut out noise.
        - Note: when we name tests, we should name it after the situation not what the end result should be:
            - Bad: it "should return false if we pass in incomplete validation data"
            - Good: it "has incomplete validation data"
        - Example: The main goal for testing `src/pages/PDFViewerPage.tsx` is to ensure that overall behavior we care about (zooming, scrolling, and etc) work as we expect it to. The goal is NOT to test a particular edge case for an internal hook. It may be that we use that edge case to express desired behavior in the page, in which case we should explicitly test that at the page level.
    - Second, following from the previous example, test end to end as much as possible. This means we test from the top down, not bottom up. If you notice, this is why we only test at the page and `lib.rs` level. This gives use two distinct benefits:
        - First, we can avoid duping tests for lower level infra code if we implicitly test that the higher level behaves as we expect.
        - Second, we can test how multiple pieces of lower level interact.
    - Third, minimally test the interesting behavior. Concretely, this means we don't test things we know to be true: either another test covers it or it's redundant in the existing test.
        - Example: `assert Count(Events) != 0` if we later `assert Event.objects.get().id == ...`
    - Fourth, you should aim to reduce the "cost" of a test down as much as possible. This means that setup code should never be repeated and that common things should be factored into a common util or local function to be used across all tests.
        - This isn't any different to our rules about making functions that are useful.
        - Example: if we're loading a document for each PDF page test, then it should be in the setup. Thus, every existing and new test knows it has a good default document to use.
