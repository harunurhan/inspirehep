import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'antd';
import { connect } from 'react-redux';
import { List } from 'immutable';

import AggregationFiltersContainer from '../../common/containers/AggregationFiltersContainer';
import PaginationContainer from '../../common/containers/PaginationContainer';
import SortByContainer from '../../common/containers/SortByContainer';
import ResultsContainer from '../../common/containers/ResultsContainer';
import NumberOfResultsContainer from '../../common/containers/NumberOfResultsContainer';
import LoadingOrChildren from '../../common/components/LoadingOrChildren';
import ResponsiveView from '../../common/components/ResponsiveView';
import DrawerHandle from '../../common/components/DrawerHandle';
import LiteratureItem from '../components/LiteratureItem';
import CiteAllActionContainer from './CiteAllActionContainer';
import VerticalDivider from '../../common/VerticalDivider';
import { searchBaseQueriesUpdate } from '../../actions/search';
import ExternalLink from '../../common/components/ExternalLink';
import EmptyOrChildren from '../../common/components/EmptyOrChildren';

function renderLiteratureItem(result, rank) {
  return <LiteratureItem metadata={result.get('metadata')} searchRank={rank} />;
}

function LiteratureSearch({
  loading,
  loadingAggregations,
  namespace,
  baseQuery,
  baseAggregationsQuery,
  onBaseQueriesChange,
  results,
}) {
  const renderAggregations = useCallback(
    () => (
      <LoadingOrChildren loading={loadingAggregations}>
        <AggregationFiltersContainer namespace={namespace} />
      </LoadingOrChildren>
    ),
    [loadingAggregations, namespace]
  );

  useEffect(
    () => {
      if (onBaseQueriesChange) {
        onBaseQueriesChange(namespace, {
          baseQuery,
          baseAggregationsQuery,
        });
      }
    },
    [namespace, baseQuery, baseAggregationsQuery, onBaseQueriesChange]
  );
  return (
    <Row className="mt3" gutter={32} type="flex" justify="start">
      <Col xs={0} lg={7}>
        <ResponsiveView min="lg" render={renderAggregations} />
      </Col>
      <Col xs={24} lg={17}>
        <LoadingOrChildren loading={loading}>
          <EmptyOrChildren
            data={results}
            title="0 results"
            description={
              <em>
                Oops! Your might want to check out our{' '}
                <ExternalLink href="https://labs.inspirehep.net/help/knowledge-base/inspire-paper-search/">
                  search tips
                </ExternalLink>
                .
              </em>
            }
          >
            <Row type="flex" align="middle" justify="end">
              <Col xs={24} lg={12}>
                <NumberOfResultsContainer namespace={namespace} />
                <VerticalDivider />
                <CiteAllActionContainer namespace={namespace} />
              </Col>
              <Col xs={12} lg={0}>
                <ResponsiveView
                  max="md"
                  render={() => (
                    <DrawerHandle
                      className="mt2"
                      handleText="Filter"
                      drawerTitle="Filter"
                    >
                      {renderAggregations()}
                    </DrawerHandle>
                  )}
                />
              </Col>
              <Col className="tr" span={12}>
                <SortByContainer namespace={namespace} />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <ResultsContainer
                  namespace={namespace}
                  renderItem={renderLiteratureItem}
                />
                <PaginationContainer namespace={namespace} />
              </Col>
            </Row>
          </EmptyOrChildren>
        </LoadingOrChildren>
      </Col>
    </Row>
  );
}

LiteratureSearch.propTypes = {
  loading: PropTypes.bool.isRequired,
  loadingAggregations: PropTypes.bool.isRequired,
  namespace: PropTypes.string.isRequired,
  onBaseQueriesChange: PropTypes.func,
  baseQuery: PropTypes.object,
  baseAggregationsQuery: PropTypes.object,
  results: PropTypes.instanceOf(List),
};

const stateToProps = (state, { namespace }) => ({
  loading: state.search.getIn(['namespaces', namespace, 'loading']),
  loadingAggregations: state.search.getIn([
    'namespaces',
    namespace,
    'loadingAggregations',
  ]),
  results: state.search.getIn(['namespaces', namespace, 'results']),
});

const dispatchToProps = dispatch => ({
  onBaseQueriesChange(namespace, baseQueries) {
    dispatch(searchBaseQueriesUpdate(namespace, baseQueries));
  },
});

export default connect(stateToProps, dispatchToProps)(LiteratureSearch);
