import { CourseState } from "../../features/course/courseSlice";

export const findNodeIndex = (course: CourseState, id: number) => {
  for (let mI = 0; mI < course.modules!.length; mI++) {
    for (let sI = 0; sI < course.modules![mI].sections!.length; sI++) {
      for (
        let aI = 0;
        aI < course.modules![mI].sections![sI].articles!.length;
        aI++
      ) {
        if (course.modules![mI].sections![sI].articles![aI].id === id) {
          return aI;
        }
      }
    }
  }
};

export const findSectionIndex = (course: CourseState, id: number) => {
  for (let mI = 0; mI < course.modules!.length; mI++) {
    for (let sI = 0; sI < course.modules![mI].sections!.length; sI++) {
      for (
        let aI = 0;
        aI < course.modules![mI].sections![sI].articles!.length;
        aI++
      ) {
        if (course.modules![mI].sections![sI].articles![aI].id === id) {
          return sI;
        }
      }
    }
  }
};

export const findModuleIndex = (course: CourseState, id: number) => {
  for (let mI = 0; mI < course.modules!.length; mI++) {
    for (let sI = 0; sI < course.modules![mI].sections!.length; sI++) {
      for (
        let aI = 0;
        aI < course.modules![mI].sections![sI].articles!.length;
        aI++
      ) {
        if (course.modules![mI].sections![sI].articles![aI].id === id) {
          return mI;
        }
      }
    }
  }
};
