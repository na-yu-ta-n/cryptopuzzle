import type { Category, Material, SrsItem } from '../types';
import defaultMaterials from '../data/defaultMaterials.json';
import { allCourseMaterials, getCourse } from '../data/courses';
import { getDueItems, dailyIndex } from './srs';
import { today } from './date';

export function allMaterials(customMaterials: Material[]): Material[] {
  return [...(defaultMaterials as Material[]), ...allCourseMaterials, ...customMaterials];
}

export function filteredMaterials(
  customMaterials: Material[],
  selectedCategory: Category | 'all',
): Material[] {
  const all = [...(defaultMaterials as Material[]), ...customMaterials];
  if (selectedCategory === 'all') return all;
  return all.filter((m) => m.category === selectedCategory);
}

export function findMaterialById(customMaterials: Material[], id: string): Material | undefined {
  return allMaterials(customMaterials).find((m) => m.id === id);
}

export function getDailyMaterial(): Material {
  const pool = [...(defaultMaterials as Material[]), ...allCourseMaterials];
  return pool[dailyIndex(today(), pool.length)];
}

export function getDueReviewMaterials(
  customMaterials: Material[],
  srs: Record<string, SrsItem>,
): Material[] {
  return getDueItems(srs)
    .map((item) => findMaterialById(customMaterials, item.materialId))
    .filter((m): m is Material => m != null);
}

export function nextLessonInCourse(
  courseId: string,
  completed: string[],
): { unitId: string; material: Material } | null {
  const course = getCourse(courseId);
  if (!course) return null;
  for (const unit of course.units) {
    for (const lesson of unit.lessons) {
      if (!completed.includes(lesson.id)) return { unitId: unit.id, material: lesson };
    }
  }
  return null;
}
