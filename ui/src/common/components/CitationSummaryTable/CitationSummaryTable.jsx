import React, { Component } from 'react';
import { stringify } from 'qs';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { Link } from 'react-router-dom';

import './CitationSummaryTable.scss';
import ExternalLink from '../ExternalLink';
import LabelWithHelp from '../LabelWithHelp';
import { LITERATURE } from '../../routes';

const CITABLE_HELP_MESSAGE = (
  <span>
    Published papers are believed to have undergone rigorous peer-review.&nbsp;
    <ExternalLink href="http://inspirehep.net/info/faq/general#published">
      Learn More
    </ExternalLink>
  </span>
);

class CitationSummaryTable extends Component {
  render() {
    const { citationSummary, searchQuery } = this.props;
    const published = citationSummary.getIn([
      'citations',
      'buckets',
      'published',
    ]);
    const citeable = citationSummary.getIn(['citations', 'buckets', 'all']);
    const hIndex = citationSummary.getIn(['h-index', 'value']);
    const urlSearchForCiteablePapers = stringify(
      searchQuery.set('q', 'citeable:true').toJS(),
      {
        indices: false,
      }
    );
    const urlSearchForPublishedPapers = stringify(
      searchQuery.set('q', 'citeable:true and refereed:true').toJS(),
      { indices: false }
    );

    return (
      <div className="__CitationTable__">
        <table>
          <tbody>
            <tr>
              <th>
                <strong className="f5">Citation Summary</strong>
              </th>
              <th>
                <LabelWithHelp
                  label="Citeable"
                  help="Citeable papers have metadata that allow us to reliably track their citations."
                />
              </th>
              <th>
                <LabelWithHelp label="Published" help={CITABLE_HELP_MESSAGE} />
              </th>
            </tr>
            <tr>
              <th>Papers</th>
              <td>
                {citeable.get('doc_count') === 0 ? (
                  '0'
                ) : (
                  <Link to={`${LITERATURE}?${urlSearchForCiteablePapers}`}>
                    {citeable.get('doc_count')}
                  </Link>
                )}
              </td>
              <td>
                {published.get('doc_count') === 0 ? (
                  '0'
                ) : (
                  <Link to={`${LITERATURE}?${urlSearchForPublishedPapers}`}>
                    {published.get('doc_count')}
                  </Link>
                )}
              </td>
            </tr>
            <tr>
              <th>Citations</th>
              <td>{citeable.getIn(['citations_count', 'value'])}</td>
              <td>{published.getIn(['citations_count', 'value'])}</td>
            </tr>
            <tr>
              <th>h-index</th>
              <td>{hIndex.get('all')}</td>
              <td>{hIndex.get('published')}</td>
            </tr>
            <tr>
              <th>Citations/paper (avg)</th>
              <td>
                {(citeable.getIn(['average_citations', 'value']) || 0).toFixed(
                  1
                )}
              </td>
              <td>
                {(published.getIn(['average_citations', 'value']) || 0).toFixed(
                  1
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

CitationSummaryTable.propTypes = {
  citationSummary: PropTypes.instanceOf(Map).isRequired,
  searchQuery: PropTypes.instanceOf(Map).isRequired,
};

export default CitationSummaryTable;
