import React, { useCallback, useEffect, useState } from 'react';
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
import EmptyOrChildren from '../../common/components/EmptyOrChildren';
import CitationSummaryBoxContainer from './CitationSummaryBoxContainer';
import CitationSummarySwitch from '../components/CitationSummarySwitch';

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
  noResultsTitle,
  noResultsDescription,
  isMainLiteratureSearch,
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

  const [isCitationSummaryVisible, setCitationSummaryVisible] = useState(false);
  const onCitationSummarySwitchChange = useCallback(checked => {
    setCitationSummaryVisible(checked);
  }, []);
  return (
    <Row className="mt3" gutter={32} type="flex" justify="center">
      <EmptyOrChildren
        data={results}
        title={noResultsTitle}
        description={noResultsDescription}
      >
        <Col xs={0} lg={7}>
          <ResponsiveView min="lg" render={renderAggregations} />
        </Col>
        <Col xs={24} lg={17}>
          <LoadingOrChildren loading={loading}>
            <Row type="flex" align="middle" justify="end">
              <Col xs={24} lg={8}>
                <NumberOfResultsContainer namespace={namespace} />
                <VerticalDivider />
                <CiteAllActionContainer namespace={namespace} />
              </Col>
              <Col xs={8} lg={0}>
                <ResponsiveView
                  max="md"
                  render={() => (
                    <DrawerHandle handleText="Filter" drawerTitle="Filter">
                      {renderAggregations()}
                    </DrawerHandle>
                  )}
                />
              </Col>
              <Col className="tr" span={16}>
                {isMainLiteratureSearch && (
                  <span className="mr2">
                    <CitationSummarySwitch
                      checked={isCitationSummaryVisible}
                      onChange={onCitationSummarySwitchChange}
                    />
                  </span>
                )}
                <SortByContainer namespace={namespace} />
              </Col>
            </Row>
            {isCitationSummaryVisible && (
              <Row className="mt2">
                <Col span={24}>
                  <CitationSummaryBoxContainer />
                </Col>
              </Row>
            )}
            <Row>
              <Col span={24}>
                <ResultsContainer
                  namespace={namespace}
                  renderItem={renderLiteratureItem}
                />
                <PaginationContainer namespace={namespace} />
              </Col>
            </Row>
          </LoadingOrChildren>
        </Col>
      </EmptyOrChildren>
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
  noResultsTitle: PropTypes.string,
  noResultsDescription: PropTypes.node,
  isMainLiteratureSearch: PropTypes.bool.isRequired,
};

const stateToProps = (state, { namespace }) => ({
  loading: state.search.getIn(['namespaces', namespace, 'loading']),
  loadingAggregations: state.search.getIn([
    'namespaces',
    namespace,
    'loadingAggregations',
  ]),
  results: state.search.getIn(['namespaces', namespace, 'results']),
  isMainLiteratureSearch: !state.search.getIn([
    'namespaces',
    namespace,
    'embedded',
  ]),
});

const dispatchToProps = dispatch => ({
  onBaseQueriesChange(namespace, baseQueries) {
    dispatch(searchBaseQueriesUpdate(namespace, baseQueries));
  },
});

export default connect(stateToProps, dispatchToProps)(LiteratureSearch);
