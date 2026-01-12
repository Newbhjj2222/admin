import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ViewsChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="title" hide />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalViews" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
