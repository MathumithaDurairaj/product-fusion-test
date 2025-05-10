import {Button, Divider, Form, Input, InputNumber, Select} from "antd";
import './NestedActivity.css';
import {useEffect, useState} from "react";

const options = [
    { value: 'pipe', label: 'pipe' },
    { value: 'steel', label: 'steel' },
    { value: 'paint', label: 'paint' }
]

const NestedActivity = () => {
    const [initialActivityArray, setInitialActivityArray] = useState([
        {
            id: Math.floor(Math.random() * 100),
            activityName: '',
            unitCount: '',
            weight: 0,
            children: [{
                id: Math.floor(Math.random() * 100),
                activityName: '',
                unitCount: '',
                weight: 0,
            }]
        }
    ]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleDelete = (parentId) => {
        setInitialActivityArray((prevState) => prevState.filter(item =>
            item.id !== parentId
        ));
    }
    const handleActivity = () => {
        setInitialActivityArray((prevState) => [...prevState,
            {
                id: Math.floor(Math.random() * 100),
                activityName: '',
                unitCount: '',
                weight: 0,
                children: [
                    {
                        id: Math.floor(Math.random() * 100),
                        activityName: '',
                        unitCount: '',
                        weight: 0,
                    }
                ]
            }
        ]);
    }

    const handleSubActivity = (parentId) => {
        setInitialActivityArray((prevState) => 
            prevState.map((activity) => 
                activity.id === parentId
                    ? {
                        ...activity,
                        children: [
                            ...activity.children,
                            {
                                id: Math.floor(Math.random() * 100),
                                activityName: '',
                                unitCount: '',
                                weight: 0,
                            }
                        ]
                    }
                    : activity
            )
        );
    }

    const handleChildDelete = (parentId, childId) => {
        setInitialActivityArray((prevState) => 
            prevState.map((parent) => 
                parent.id === parentId
                    ? {
                        ...parent,
                        children: parent.children.filter(child => child.id !== childId)
                    }
                    : parent
            )
        );
    }

    const handleSubmit = (values) => {
        const formattedData = initialActivityArray.map((activity) => {
            const parentData = {
                id: activity.id,
                activityName: values[`activity-name-${activity.id}`] || '',
                unitCount: values[`unitCount-${activity.id}`] || '',
                weight: values[`weight-${activity.id}`] || 0,
                children: activity.children.map((child) => ({
                    id: child.id,
                    activityName: values[`activityName-${child.id}`] || '',
                    unitCount: values[`unitCount-${child.id}`] || '',
                    weight: values[`weight-${child.id}`] || 0
                }))
            };
            return parentData;
        });

        console.log('Formatted Data:', formattedData);
    }

    const errorCalculation = () => {
        setErrors([]);
        setIsDisabled(false);

        initialActivityArray.forEach((activity) => {
            const parentWeight = activity.weight || 0;
            let childrenSum = 0;
            
            activity.children.forEach(child => {
                childrenSum += child.weight || 0;
            });
    
            if (parentWeight !== childrenSum) {
                setIsDisabled(true);
                setErrors(prev => [...prev, `Activity #${activity.id}: Parent weight (${parentWeight}%) does not match with the sum of sub item weights (${childrenSum}%)`]);
            }
        });
    };

    useEffect(() => {
        errorCalculation();
    }, [initialActivityArray]);

    return (
        <Form
            className={'form-container'}
            layout={'vertical'}
            onFinish={handleSubmit}
        >
            <div className={'activity-header'}>
                <h2 className={'title'}>NX MUI Testing - CP Checklist</h2>
                <Button type="default" color={'danger'} variant={'outlined'} onClick={() => handleActivity()}>
                    + Add Activity
                </Button>
                <div className={'save-details-container'}>
                    <div className={isDisabled ? 'weight-mismatch' : 'weight-match'}>Weight 100%</div>
                    <Button type={'primary'} htmlType={'submit'} disabled={isDisabled}>
                        save
                    </Button>
                </div>
            </div>
            <div className={'activity-body'}>
                {initialActivityArray.length > 0 ? (
                    initialActivityArray.map((activity) => (
                        <div key={activity.id}>
                            <div className={'parent-activity'}>
                                <Form.Item>
                                    <p>#{activity.id}</p>
                                </Form.Item>
                                <Form.Item label={'Activity Name'} name={`activity-name-${activity.id}`}>
                                    <Input placeholder={'Activity Name'} />
                                </Form.Item>
                                <Form.Item label={'Unit of Count'} name={`unitCount-${activity.id}`}>
                                    <Select
                                        placeholder={'Unit of Count'}
                                        options={options}
                                    />
                                </Form.Item>
                                <Form.Item label={'Weight'} name={`weight-${activity.id}`}>
                                    <InputNumber 
                                        max={100} 
                                        placeholder={'Weight'} 
                                        suffix={'%'} 
                                        onChange={(value) => {
                                            setInitialActivityArray(prevState => 
                                                prevState.map(item => 
                                                    item.id === activity.id 
                                                        ? {...item, weight: value || 0}
                                                        : item
                                                )
                                            );
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type={'primary'} onClick={() => handleDelete(activity.id)}>
                                        Delete
                                    </Button>
                                </Form.Item>
                            </div>
                            {activity?.children.length > 0 && activity?.children.map((item) => (
                                <div key={item.id} className={'children-activities'}>
                                    <Form.Item>
                                        <p>#{item.id}</p>
                                    </Form.Item>
                                    <Form.Item label={'Activity Name'} name={`activityName-${item.id}`}>
                                        <Input placeholder={'Activity Name'} />
                                    </Form.Item>
                                    <Form.Item label={'Unit of Count'} name={`unitCount-${item.id}`}>
                                        <Select
                                            placeholder={'Unit of Count'}
                                            options={options}
                                        />
                                    </Form.Item>
                                    <Form.Item label={'Weight'} name={`weight-${item.id}`}>
                                        <InputNumber 
                                            max={100} 
                                            suffix={'%'} 
                                            onChange={(value) => {
                                                setInitialActivityArray(prevState => 
                                                    prevState.map(parent => 
                                                        parent.id === activity.id
                                                            ? {
                                                                ...parent,
                                                                children: parent.children.map(child =>
                                                                    child.id === item.id
                                                                        ? {...child, weight: value || 0}
                                                                        : child
                                                                )
                                                            }
                                                            : parent
                                                    )
                                                );
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type={'primary'} onClick={() => handleChildDelete(activity.id, item.id)}>
                                            Delete
                                        </Button>
                                    </Form.Item>
                                </div>
                            ))}
                            <Button type="default" color={'danger'} variant={'outlined'} onClick={() => handleSubActivity(activity.id)}>
                                + Add Sub Activity
                            </Button>
                            <Divider />
                        </div>
                    ))
                ) : (
                    <div className="no-data">
                        <p className={'no-data-text'}>No Activities show</p>
                    </div>
                )}
            </div>
        </Form>
    );
}
export default NestedActivity;
