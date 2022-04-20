import { CourseState } from "../../features/course/courseSlice";

export const findNextArticleId = (
  course: CourseState,
  nI: number,
  sI: number,
  mI: number
) => {
  if (nI + 1 < course.modules![mI].sections![sI].articles!.length) {
    // Article number is smaller than all articles in section (e.g. article 2/3)
    return course.modules![mI].sections![sI].articles![nI + 1].id;
  } else if (
    nI + 1 === course.modules![mI].sections![sI].articles!.length &&
    sI + 1 < course.modules![mI].sections!.length
  ) {
    // Article number equals article length (e.g. 3/3) and the section number is smaller than all sections in module (e.g. section 1/4)
    return course.modules![mI].sections![sI + 1].articles![0].id;
  } else if (
    nI + 1 === course.modules![mI].sections![sI].articles!.length &&
    sI + 1 === course.modules![mI].sections!.length &&
    mI + 1 < course.modules!.length
  ) {
    // Last article of section (3/3) and last section of module (4/4) and there is still another module (e.g. module 1/2)
    return course.modules![mI + 1].sections![0].articles![0].id;
  } else {
    // There is no article left in this course
    return undefined;
  }
};

export const findPrevArticleId = (
  course: CourseState,
  nI: number,
  sI: number,
  mI: number
) => {
  if (nI != 0) {
    // Article number is not 1 (e.g. article 2 or 3)
    return course.modules![mI].sections![sI].articles![nI - 1].id;
  } else if (sI != 0) {
    // Section number is not 1 (e.g. section 2 or 3)
    return course.modules![mI].sections![sI - 1].articles![0].id;
  } else if (mI != 0) {
    // Module number is not 1 (e.g. module 2 or 3)
    return course.modules![mI - 1].sections![0].articles![0].id;
  } else {
    // Aricle num 1, section 1, module 1
    return undefined;
  }
};
