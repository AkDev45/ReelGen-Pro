
import { ProjectItem } from '../types';

const STORAGE_KEY_PROJECTS = 'reelgen_projects';

export const projectService = {
  getProjects: (userId: string): ProjectItem[] => {
    try {
      const allProjects = JSON.parse(localStorage.getItem(STORAGE_KEY_PROJECTS) || '{}');
      return allProjects[userId] || [];
    } catch (e) {
      console.error("Failed to load projects", e);
      return [];
    }
  },

  saveProject: (userId: string, project: ProjectItem) => {
    const allProjects = JSON.parse(localStorage.getItem(STORAGE_KEY_PROJECTS) || '{}');
    const userProjects = allProjects[userId] || [];
    
    // Add to beginning
    userProjects.unshift(project);
    
    // Limit storage to 50 items per user locally just to be safe, though plan limits exist logic-side
    if (userProjects.length > 50) userProjects.pop();
    
    allProjects[userId] = userProjects;
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(allProjects));
    return userProjects;
  }
};
