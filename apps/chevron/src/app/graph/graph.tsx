// @ts-nocheck
"use client";
import { drag } from "d3-drag";
import {
	SimulationNodeDatum,
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	forceX,
	forceY,
} from "d3-force";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import graph from "public/data/graph.json";
import React, { useRef, useEffect } from "react";

type Node = (typeof graph)["nodes"][number] & SimulationNodeDatum;
type Edge = (typeof graph)["edges"][number];

interface ForceGraphProps {
	width?: number;
	height?: number;
}

const getNodeRadius = (node: Node) => (node.type === "page" ? 40 : 20);
const getNodeFill = (node: Node) =>
	node.type === "page" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))";

const ForceGraph: React.FC<ForceGraphProps> = ({
	width = 600,
	height = 400,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (!svgRef.current) return;

		const svg = select(svgRef.current);
		svg.selectAll("*").remove(); // Clear previous render

		const g = svg.append("g");

		// Create force simulation
		const simulation = forceSimulation<Node, Edge>(graph.nodes as Node[])
			.force("center", forceCenter(width / 2, height / 2))
			.force(
				"link",
				forceLink<Node, Edge>(graph.edges)
					.id((d) => d.id)
					.distance(150),
			)
			.force("charge", forceCollide().radius(100))
			.force("manybody", forceManyBody().strength(-500))
			.force("x", forceX().strength(0.1))
			.force("y", forceY().strength(0.1));

		// Reset zoom on background click
		svg.on("click", (event) => {
			if (event.target === svg.node()) {
				svg
					.transition()
					.duration(750)
					.call(zoomBehavior.transform, zoomIdentity);
			}
		});

		// Create edges
		const edges = g
			.selectAll("line")
			.data(graph.edges)
			.join("line")
			.attr("stroke", "black")
			.attr("stroke-width", 2);

		// Create nodes
		const nodes = g
			.selectAll("g")
			.data(graph.nodes)
			.join("g")
			.call(
				drag<SVGGElement, Node>()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended),
			)
			.on("click", (event, d: Node) => {
				event.stopPropagation();
				const node = event.currentTarget;
				const bbox = node.getBBox();
				const dx = width / 2 - (bbox.x + bbox.width / 2);
				const dy = height / 2 - (bbox.y + bbox.height / 2);
				const scale = 2;
				const translate = zoomIdentity.translate(dx, dy).scale(scale);
				svg.transition().duration(750).call(zoomBehavior.transform, translate);
			});

		nodes
			.append("circle")
			.attr("r", (d) => getNodeRadius(d))
			.attr("fill", (d) => getNodeFill(d))
			.attr("stroke", "var(--primary)")
			.attr("stroke-width", 1);

		const labels = nodes
			.append("text")
			.text((d) => d.label)
			.attr("node-type", (d) => d.type)
			.attr("text-anchor", "middle")
			.attr("dy", ".3em")
			.attr("fill", "var(--primary-foreground)")
			.style("display", "none");

		// Add zoom behavior
		const zoomBehavior = zoom<SVGSVGElement, unknown>()
			.extent([
				[0, 0],
				[width, height],
			])
			.scaleExtent([0.1, 4])
			.on("zoom", (event) => {
				g.attr("transform", event.transform.toString());
				labels.style("display", (d) => {
					if (d.type === "page") {
						return event.transform.k > 1 ? "inline" : "none";
					}

					return event.transform.k > 1.5 ? "inline" : "none";
				});
			});
		svg.call(zoomBehavior);

		// Update function
		function ticked() {
			edges
				.attr("x1", (d) => (d.source as Node).x || 0)
				.attr("y1", (d) => (d.source as Node).y || 0)
				.attr("x2", (d) => (d.target as Node).x || 0)
				.attr("y2", (d) => (d.target as Node).y || 0);

			nodes.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`);
		}

		simulation.on("tick", ticked);

		// Drag functions
		function dragstarted(event: any, d: Node) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(event: any, d: Node) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(event: any, d: Node) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

		return () => {
			simulation.stop();
		};
	}, [width, height]);

	return (
		<div>
			<svg ref={svgRef} width={width} height={height} />
		</div>
	);
};

export default ForceGraph;
