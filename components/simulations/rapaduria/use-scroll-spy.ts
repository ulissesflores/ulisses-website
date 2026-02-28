'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { SimulationChartExtra } from '@/components/simulations/rapaduria/types';

const DEFAULT_THRESHOLD = [0, 0.15, 0.3, 0.5, 0.75, 1];

type UseScrollSpyOptions = {
  selector?: string;
  rootMargin?: string;
  threshold?: number[];
  initialSectionId?: string;
  initialChart?: SimulationChartExtra;
};

type UseScrollSpyResult = {
  activeSectionId: string | null;
  activeChart: SimulationChartExtra | null;
};

function isSimulationChartExtra(value: unknown): value is SimulationChartExtra {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const chart = value as Partial<SimulationChartExtra>;
  return (
    typeof chart.date === 'string' &&
    typeof chart.revenue === 'number' &&
    typeof chart.approval === 'number' &&
    Array.isArray(chart.capabilities)
  );
}

function parseChartExtra(raw: string | null): SimulationChartExtra | null {
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isSimulationChartExtra(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function useScrollSpy(options: UseScrollSpyOptions = {}): UseScrollSpyResult {
  const {
    selector = '[data-chart-extra]',
    rootMargin = '0px 0px -45% 0px',
    threshold = DEFAULT_THRESHOLD,
    initialSectionId,
    initialChart,
  } = options;

  const initialThreshold = useMemo(() => threshold, [threshold]);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(initialSectionId ?? null);
  const [activeChart, setActiveChart] = useState<SimulationChartExtra | null>(initialChart ?? null);
  const activeSectionIdRef = useRef<string | null>(initialSectionId ?? null);
  const activeChartRawRef = useRef<string | null>(initialChart ? JSON.stringify(initialChart) : null);

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!nodes.length) {
      return;
    }

    const intersectionById = new Map<string, number>();

    const updateFromWinner = (targetId: string) => {
      if (!targetId) {
        return;
      }

      const targetNode = nodes.find((node) => node.id === targetId);
      if (!targetNode) {
        return;
      }

      if (activeSectionIdRef.current !== targetId) {
        activeSectionIdRef.current = targetId;
        setActiveSectionId(targetId);
      }

      const rawChartExtra = targetNode.getAttribute('data-chart-extra');
      if (!rawChartExtra || rawChartExtra === activeChartRawRef.current) {
        return;
      }

      const parsed = parseChartExtra(rawChartExtra);
      if (parsed) {
        activeChartRawRef.current = rawChartExtra;
        setActiveChart(parsed);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          intersectionById.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let winnerId = '';
        let winnerRatio = 0;

        nodes.forEach((node) => {
          const ratio = intersectionById.get(node.id) ?? 0;
          if (ratio > winnerRatio) {
            winnerRatio = ratio;
            winnerId = node.id;
          }
        });

        if (winnerId) {
          updateFromWinner(winnerId);
          return;
        }

        const fallbackNode = nodes
          .map((node) => ({ node, distance: Math.abs(node.getBoundingClientRect().top) }))
          .sort((a, b) => a.distance - b.distance)[0]?.node;

        if (fallbackNode?.id) {
          updateFromWinner(fallbackNode.id);
        }
      },
      {
        root: null,
        rootMargin,
        threshold: initialThreshold,
      },
    );

    nodes.forEach((node) => observer.observe(node));
    const rafId = window.requestAnimationFrame(() => {
      const firstNodeId = nodes[0]?.id;
      if (firstNodeId) {
        updateFromWinner(firstNodeId);
      }
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [initialThreshold, rootMargin, selector]);

  return {
    activeSectionId,
    activeChart,
  };
}
