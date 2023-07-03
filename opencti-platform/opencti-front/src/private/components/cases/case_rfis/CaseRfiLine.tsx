import React, { FunctionComponent } from 'react';
import { graphql, useFragment } from 'react-relay';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { KeyboardArrowRightOutlined } from '@mui/icons-material';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import { useFormatter } from '../../../../components/i18n';
import { Theme } from '../../../../components/Theme';
import { DataColumns } from '../../../../components/list_lines';
import ItemStatus from '../../../../components/ItemStatus';
import StixCoreObjectLabels from '../../common/stix_core_objects/StixCoreObjectLabels';
import ItemMarkings from '../../../../components/ItemMarkings';
import ItemIcon from '../../../../components/ItemIcon';
import {
  CaseRfiLineCase_node$data,
  CaseRfiLineCase_node$key,
} from './__generated__/CaseRfiLineCase_node.graphql';

const useStyles = makeStyles<Theme>((theme) => ({
  item: {
    paddingLeft: 10,
    height: 50,
  },
  itemIcon: {
    color: theme.palette.primary.main,
  },
  bodyItem: {
    height: 20,
    fontSize: 13,
    float: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingRight: 10,
  },
  goIcon: {
    position: 'absolute',
    right: -10,
  },
  itemIconDisabled: {
    color: theme.palette.grey?.[700],
  },
  placeholder: {
    display: 'inline-block',
    height: '1em',
    backgroundColor: theme.palette.grey?.[700],
  },
}));

interface CaseRfiLineComponentProps {
  dataColumns: DataColumns;
  onLabelClick: (
    k: string,
    id: string,
    value: Record<string, unknown>,
    event: React.KeyboardEvent
  ) => void;
  node: CaseRfiLineCase_node$key;
  selectedElements: Record<string, CaseRfiLineCase_node$data>;
  deSelectedElements: Record<string, CaseRfiLineCase_node$data>;
  onToggleEntity: (
    entity: CaseRfiLineCase_node$data,
    event: React.SyntheticEvent
  ) => void;
  selectAll: boolean;
  onToggleShiftEntity: (
    index: number,
    entity: CaseRfiLineCase_node$data,
    event: React.SyntheticEvent
  ) => void;
  index: number;
}

const caseFragment = graphql`
  fragment CaseRfiLineCase_node on CaseRfi {
    id
    name
    description
    created
    information_types
    priority
    severity
    createdBy {
      ... on Identity {
        id
        name
        entity_type
      }
    }
    objectMarking {
      edges {
        node {
          id
          definition_type
          definition
          x_opencti_order
          x_opencti_color
        }
      }
    }
    objectLabel {
      edges {
        node {
          id
          value
          color
        }
      }
    }
    creators {
      id
      name
    }
    status {
      id
      order
      template {
        name
        color
      }
    }
    workflowEnabled
  }
`;

export const CaseRfiLine: FunctionComponent<CaseRfiLineComponentProps> = ({
  dataColumns,
  node,
  onLabelClick,
  selectedElements,
  deSelectedElements,
  onToggleEntity,
  selectAll,
  onToggleShiftEntity,
  index,
}) => {
  const classes = useStyles();
  const { fd } = useFormatter();
  const data = useFragment(caseFragment, node);
  return (
    <ListItem
      classes={{ root: classes.item }}
      divider={true}
      button={true}
      component={Link}
      to={`/dashboard/cases/rfis/${data.id}`}
    >
      <ListItemIcon
        classes={{ root: classes.itemIcon }}
        style={{ minWidth: 40 }}
        onClick={(event) => (event.shiftKey
          ? onToggleShiftEntity(index, data, event)
          : onToggleEntity(data, event))
        }
      >
        <Checkbox
          edge="start"
          checked={
            (selectAll && !(data.id in (deSelectedElements || {})))
            || data.id in (selectedElements || {})
          }
          disableRipple={true}
        />
      </ListItemIcon>
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        <ItemIcon type={'Case-Rfi'} />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <Tooltip title={data.name}>
              <div
                className={classes.bodyItem}
                style={{ width: dataColumns.name.width }}
              >
                {data.name}
              </div>
            </Tooltip>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.priority.width }}
            >
              {data.priority}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.severity.width }}
            >
              {data.severity}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.createdBy.width }}
            >
              {data.createdBy?.name}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.creator.width }}
            >
              {(data.creators ?? []).map((c) => c?.name).join(', ')}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.objectLabel.width }}
            >
              <StixCoreObjectLabels
                variant="inList"
                labels={data.objectLabel}
                onClick={onLabelClick}
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.created.width }}
            >
              {fd(data.created)}
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.x_opencti_workflow_id.width }}
            >
              <ItemStatus
                status={data.status}
                variant="inList"
                disabled={!data.workflowEnabled}
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.objectMarking.width }}
            >
              <ItemMarkings
                variant="inList"
                markingDefinitionsEdges={data.objectMarking?.edges ?? []}
                limit={1}
              />
            </div>
          </div>
        }
      />
      <ListItemIcon classes={{ root: classes.goIcon }}>
        <KeyboardArrowRightOutlined />
      </ListItemIcon>
    </ListItem>
  );
};

export const CaseRfiLineDummy = ({
  dataColumns,
}: {
  dataColumns: DataColumns;
}) => {
  const classes = useStyles();
  return (
    <ListItem classes={{ root: classes.item }} divider={true}>
      <ListItemIcon
        classes={{ root: classes.itemIconDisabled }}
        style={{ minWidth: 40 }}
      >
        <Checkbox edge="start" disabled={true} disableRipple={true} />
      </ListItemIcon>
      <ListItemIcon classes={{ root: classes.itemIcon }}>
        <Skeleton animation="wave" variant="circular" width={30} height={30} />
      </ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.name.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.priority.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.severity.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.createdBy.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.creator.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.objectLabel.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.created.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.x_opencti_workflow_id.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
            <div
              className={classes.bodyItem}
              style={{ width: dataColumns.objectMarking.width }}
            >
              <Skeleton
                animation="wave"
                variant="rectangular"
                width="90%"
                height="100%"
              />
            </div>
          </div>
        }
      />
      <ListItemIcon classes={{ root: classes.goIcon }}>
        <KeyboardArrowRightOutlined />
      </ListItemIcon>
    </ListItem>
  );
};