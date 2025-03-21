
import React from 'react';
import { Card } from 'react-bootstrap';
import classNames from 'classnames';

type StatisticsWidgetProps = {
  textClass?: string;
  bgClass?: string;
  iconpath?: string;
  title: string;
  description: string;
  stats?: string;
  cardHeight?: string; // Add this line

  trend: {
    textClass?: string;
    icon?: string;
    value?: string;
    time?: string;
  };
  total?: number; 
};
const StatisticsWidget: React.FC<StatisticsWidgetProps> = ({
  textClass,
  bgClass,
  iconpath,
  title,
  stats,
  trend,
  description,
  total,
  cardHeight, // Add this line

}: StatisticsWidgetProps) => {
  
  return (
    <Card className={classNames('widget-flat', bgClass)} style={{ height: cardHeight }}>
      <Card.Body>
        {iconpath && (
          <div className="float-end">
            <img src={iconpath} alt="Shape" />
          </div>
        )}
        <h5
          className={classNames('mt-0', 'header-title', textClass ? textClass : 'text-muted')}
          title={description}
        >
          {title}
        </h5>
        <h3 className={classNames('mt-3', 'mb-3', textClass ? textClass : null)}>
          <span className="page-title" style={{ fontSize: '45px' }}>
            {stats}
          </span>
          {total && (
            <span className="header-title ms-2" style={{ fontSize: '20px' }}>
              /<span style={{ fontSize: '20px' }}>{total}</span>
            </span>
          )}
        </h3>

        {trend && (
          <p className={classNames('mb-0', textClass ? textClass : 'text-muted')}>
            <span className={classNames(trend.textClass, 'me-2')}>
              <i className={classNames(trend.icon)}></i> {trend.value}
            </span>
            <span className="text-nowrap">{trend.time}</span>
          </p>
        )}
      </Card.Body>
    </Card>
  );
};

export default StatisticsWidget;
