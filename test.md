# Unit Testing Documentation

## 📋 Overview

This document describes the unit tests implemented for the **AWS UG Ensenada Dashboard** project. The tests focus on validating the business logic of utility functions that process and transform member data.

## 🛠️ Configuration

### Testing Framework
- **Vitest**: Fast and modern testing framework compatible with Vite
- **happy-dom**: Lightweight DOM environment for testing
- **Coverage Provider**: v8

### Configuration Files
- `vite.config.js`: Contains Vitest configuration integrated with Vite
- Coverage configuration with exclusions for `node_modules/`, `dist/`, scripts, and config files

### Available Scripts

```bash
# Run tests once
npm test

# Run tests in watch mode (development)
npm run test:watch

# Open visual test interface
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## 📁 Test Structure

```
src/
└── utils/
    ├── parseMembers.js         # Utility functions
    └── parseMembers.test.js    # Test file
```

## 🧪 Test Suites

### 1. `computeStats()`

**Purpose**: Calculate general statistics for group members.

**Functionality**: Returns an object with:
- `total`: Total number of members
- `cities`: Number of unique cities
- `active`: Members with at least 1 event attended
- `organizers`: Members with role different from 'MEMBER'

**Tests (5)**:
1. ✅ Should calculate statistics correctly with valid data
2. ✅ Should handle empty array
3. ✅ Should filter empty locations when counting cities
4. ✅ Should count only members with events > 0 as active
5. ✅ Should count organizers correctly excluding MEMBER

**Validated Edge Cases**:
- Empty arrays
- Null/undefined/empty locations
- Members with no events (0 events)
- Different role types (ORGANIZER, CO-ORGANIZER, ASSISTANT_ORGANIZER)

---

### 2. `computeGrowth()`

**Purpose**: Calculate cumulative monthly growth of the group.

**Functionality**: 
- Groups members by join month
- Calculates cumulative total month by month
- Returns chronologically ordered array with Spanish date format

**Tests (4)**:
1. ✅ Should calculate cumulative growth correctly
2. ✅ Should sort by ascending date
3. ✅ Should ignore invalid or empty dates
4. ✅ Should return empty array with empty data

**Output Structure**:
```javascript
[
  { mes: "ene 24", total: 2, nuevos: 2 },
  { mes: "feb 24", total: 4, nuevos: 2 },
  ...
]
```

**Validated Edge Cases**:
- Invalid dates (non-date strings)
- Empty or null dates
- Correct chronological ordering
- Correct cumulative totals

---

### 3. `computeLocations()`

**Purpose**: Get the top 10 locations with most members.

**Functionality**:
- Groups members by location
- Sorts from highest to lowest count
- Limits results to top 10
- Classifies empty locations as "Desconocida" (Unknown)

**Tests (4)**:
1. ✅ Should return top 10 locations sorted by count
2. ✅ Should limit results to 10 locations
3. ✅ Should handle empty locations as "Desconocida"
4. ✅ Should handle empty array

**Output Structure**:
```javascript
[
  { ciudad: "Ensenada", miembros: 25 },
  { ciudad: "Tijuana", miembros: 15 },
  ...
]
```

**Validated Edge Cases**:
- More than 10 locations (verifies limit)
- Null/undefined/empty locations
- Descending order by count
- Empty arrays

---

### 4. `computeTopContributors()`

**Purpose**: Get the N most active contributors in the group.

**Functionality**:
- Filters members with at least 1 event attended
- Sorts by events attended (descending)
- Allows specifying limit (default: 10)
- Does not mutate original array

**Tests (6)**:
1. ✅ Should return top contributors sorted by events
2. ✅ Should filter members without events
3. ✅ Should respect specified limit n
4. ✅ Should use 10 as default limit
5. ✅ Should handle empty array
6. ✅ Should not mutate original array

**Validated Edge Cases**:
- Members with 0 events (excluded)
- Custom limit vs default
- Immutability of original data
- Empty arrays

---

### 5. `computeEventAttendance()`

**Purpose**: Calculate member attendance grouped by event date.

**Functionality**:
- Groups by last attendance date
- Counts attendees per date
- Sorts chronologically
- Formats dates in Spanish

**Tests (5)**:
1. ✅ Should group attendees by date
2. ✅ Should sort by ascending date
3. ✅ Should ignore invalid or empty dates
4. ✅ Should include fechaCompleta in YYYY-MM-DD format
5. ✅ Should handle empty array

**Output Structure**:
```javascript
[
  { 
    fecha: "15 ene 24", 
    asistentes: 5, 
    fechaCompleta: "2024-01-15" 
  },
  ...
]
```

**Validated Edge Cases**:
- Invalid or empty dates
- Multiple attendances on the same date
- Chronological ordering
- Consistent date formatting
- Empty arrays

---

## 📊 Execution Results

```
✓ src/utils/parseMembers.test.js (24 tests) 19ms
  ✓ computeStats (5)
  ✓ computeGrowth (4)
  ✓ computeLocations (4)
  ✓ computeTopContributors (6)
  ✓ computeEventAttendance (5)

Test Files  1 passed (1)
     Tests  24 passed (24)
  Duration  ~450ms
```

## 🔄 CI/CD Integration

Tests are integrated into all project CI/CD pipelines:

### Jenkins (`cicd/Jenkinsfile`)
```groovy
stage('Test') {
    steps {
        sh 'npm test'
    }
}
```
- Runs after `Install` and before `Build`
- Fails the pipeline if any test doesn't pass

### Bitbucket Pipelines (`cicd/bitbucket-pipelines.yml`)
```yaml
- step:
    name: Test
    caches:
      - node
    script:
      - npm test
```
- Independent step between Install and Build
- Uses node_modules cache

### AWS CodeBuild (`cicd/buildspec.yml`)
```yaml
pre_build:
  commands:
    - npm test
```
- Runs in the `pre_build` phase
- Must complete successfully before continuing to build

## 🎯 Test Coverage

Current tests cover:

- ✅ **Pure functions** from the `parseMembers.js` module
- ✅ **Success cases** with valid data
- ✅ **Edge cases** (empty arrays, null/undefined data)
- ✅ **Data validation** (invalid dates, numeric values)
- ✅ **Data transformations** (sorting, formatting, grouping)
- ✅ **Immutability** (no modification of original data)

### Uncovered Areas (Future Improvements)

- ⚠️ React components (StatCards, GrowthChart, LocationChart, etc.)
- ⚠️ Sanitization script (`scripts/sanitize-data.js`)
- ⚠️ Integration tests with real CSV
- ⚠️ E2E tests of complete application

## 📝 Implemented Best Practices

1. **Descriptive tests**: Clear names in Spanish explaining what is being tested
2. **Arrange-Act-Assert**: Clear structure in each test
3. **Independence**: Each test is independent and doesn't affect others
4. **Test data**: Use of representative synthetic data
5. **Edge case coverage**: Validation of boundary scenarios
6. **Atomic tests**: Each test validates one thing
7. **Immutability**: Verification that functions don't mutate data

## 🚀 Local Execution

```bash
# In project root
cd /taller-cicd

# Run all tests
npm test

# View results in verbose mode
npm test -- --reporter=verbose

# Run tests with coverage
npm run test:coverage
```

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Test-Driven Development (TDD)](https://www.agilealliance.org/glossary/tdd/)

---

**Author**: AWS UG Ensenada CI/CD System  
**Status**: ✅ 24/24 tests passing
