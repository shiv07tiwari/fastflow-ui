import React from "react";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import {Alert} from "antd";

interface Props {
    value: Record<string, Record<string, any>>[];
}

interface OneLineGraphProps {
    description: string;
    label: string;
    usage_key: string;
    x: any[];
    y: any[];
}

const OneLineGraph: React.FC<OneLineGraphProps> = ({description, label, usage_key, x, y}) => {

    // Convert to number and then sort the values
    x = x.map((value: any) => Number(value));
    y = y.map((value: any) => Number(value));
    x.sort(); y.sort();
    const total = x.length;

    const data = x.map((value, index) => {
        return {
            y: y[index],
            x: x[index],
        }
    });

    // sort the data by x
    data.sort((a, b) => a.x - b.x);

    return (
        <>
            <div className="card my-4">
                <div className="card-header">
                    {description}
                </div>
                <div className="card-body">
                    {label}
                </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={1}
                    height={100}
                    data={data}
                >
                    <XAxis dataKey="x"/>
                    <YAxis/>
                    <Tooltip/>
                    <Line type="monotone" dataKey="y" stroke="#8884d8" activeDot={{r: total}}/>
                </LineChart>
            </ResponsiveContainer>
        </>

    )


};

const DataAnalysisCard: React.FC<Props> = ({value}) => {
    const valueLength = Object.keys(value).length;
    if (valueLength === 0) {
        // Optionally handle empty objects or return null or some fallback UI.
        return (
            <div className="text-danger m-3">
                No Data Analysis Available
            </div>
        )
    }
    const analysisResponse = value[0].response;

    return (
        <div className="d-flex flex-column"
             style={{
                 height: '800px',
                 padding: '32px',
        }}
        >
            <Alert
                showIcon
                closable
                className="text-black fw-bold"
                message="This feature is still experimental. We realize that LLMs are not good
                at generating data analysis. We are working on improving this feature using specialized Machine Learning models."
                type="warning"
            />
            {
                analysisResponse.map((analysis: Record<string, any>) => {
                    const analysisKeys = Object.keys(analysis);
                    const analysisValues = Object.values(analysis);
                    return (
                        analysisKeys.map((key: any) => {
                            if (key === "one_line_graph") {
                                const oneLineGraph = analysis[key];
                                return (
                                    <OneLineGraph
                                        description={oneLineGraph.description}
                                        label={oneLineGraph.label}
                                        usage_key={oneLineGraph.usage_key}
                                        x={oneLineGraph.x}
                                        y={oneLineGraph.y}
                                    />
                                )
                            }
                            return (
                                <div className="card m-3">
                                    AAA: {key.toString()}
                                    {
                                        analysisValues.map((value: any) => {
                                            return (
                                                <div>
                                                    {value.toString()}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            )
                        })
                    )
                })
            }
        </div>

    )
};

export default DataAnalysisCard;
