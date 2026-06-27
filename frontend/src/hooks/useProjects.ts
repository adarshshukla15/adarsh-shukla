import { useState, useEffect, useCallback } from 'react';
import { projectService } from '../services/project.service';
import { Project } from '../types/project';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getProjects();
      setProjects(data);
    } catch (err: any) {
      console.error('Failed to load projects:', err);
      if (!err.response && err.code === 'ERR_NETWORK') {
        setError('Unable to connect to server');
      } else {
        setError('Unable to connect to server');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
