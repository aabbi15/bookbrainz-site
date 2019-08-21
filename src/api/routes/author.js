/*
 * Copyright (C) 2019  Akhilesh Kumar
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */


import * as _ from 'lodash';
import * as utils from '../helpers/utils';

import {getAuthorBasicInfo, getEntityAliases, getEntityIdentifiers, getEntityRelationships} from '../helpers/formatEntityData';
import {loadEntityRelationshipsForBrowse, validateBrowseRequestQueryParameters} from '../helpers/middleware';
import {Router} from 'express';

import {makeEntityLoader} from '../helpers/entityLoader';


const router = Router();

const authorBasicRelations = [
	'defaultAlias.language',
	'disambiguation',
	'authorType',
	'gender',
	'beginArea',
	'endArea'
];

const authorError = 'Author not found';

/**
 *@swagger
 *definitions:
 *  AuthorDetail:
 *   type: object
 *   properties:
 *     bbid:
 *       type: string
 *       format: uuid
 *       example: '2e5f49a8-6a38-4cc7-97c7-8e624e1fc2c1'
 *     beginArea:
 *       type: string
 *       example: 'United States'
 *     beginDate:
 *       type: string
 *       example: '1907-07-07'
 *     defaultAlias:
 *         $ref: '#/definitions/Alias'
 *     disambiguation:
 *       type: string
 *       example: 'Robert A. Heinlein'
 *     endArea:
 *       type: string
 *       example: 'United States'
 *     endDate:
 *       type: string
 *       example: '1988-05-08'
 *     ended:
 *       type: boolean
 *       example: true
 *     gender:
 *       type: string
 *       example: 'Male'
 *     type:
 *       type: string
 *       example: 'Person'
 *  BrowsedAuthors:
 *   type: object
 *   properties:
 *     bbid:
 *       type: string
 *       format: uuid
 *       example: 'f94d74ce-c748-4130-8d59-38b290af8af3'
 *     relatedAuthors:
 *       type: array
 *       items:
 *         type: object
 *         properties:
 *           entity:
 *             $ref: '#/definitions/AuthorDetail'
 *           relationships:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                  relationshipTypeID:
 *                    type: number
 *                    example: 8
 *                  relationshipType:
 *                    type: string
 *                    example: 'Author'
 */


/**
 *@swagger
 *'/author/{bbid}':
 *  get:
 *     tags:
 *       - Lookup Requests
 *     summary: Lookup Author by BBID
 *     description: Returns the basic details of an Author
 *     operationId: getAuthorByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bbid
 *         in: path
 *         description: BBID of the Author
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Basic information of an Author entity
 *         schema:
 *             $ref: '#/definitions/AuthorDetail'
 *       404:
 *         description: Author not found
 *       406:
 *         description: Invalid BBID
 */

router.get('/:bbid',
	makeEntityLoader('Author', authorBasicRelations, authorError),
	async (req, res) => {
		const authorBasicInfo = await getAuthorBasicInfo(res.locals.entity);
		return res.status(200).send(authorBasicInfo);
	});


/**
 *	@swagger
 * '/author/{bbid}/aliases':
 *   get:
 *     tags:
 *       - Lookup Requests
 *     summary: Get list of aliases of an Author by BBID
 *     description: Returns the list of aliases of an Author
 *     operationId: getAliasesOfAuthorByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bbid
 *         in: path
 *         description: BBID of the Author
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of aliases with BBID of an Author entity
 *         schema:
 *             $ref: '#/definitions/Aliases'
 *       404:
 *         description: Author not found
 *       406:
 *         description: Invalid BBID
 */

router.get('/:bbid/aliases',
	makeEntityLoader('Author', utils.aliasesRelations, authorError),
	async (req, res, next) => {
		const authorAliasesList = await getEntityAliases(res.locals.entity);
		return res.status(200).send(authorAliasesList);
	});

/**
 *	@swagger
 * '/author/{bbid}/identifiers':
 *   get:
 *     tags:
 *       - Lookup Requests
 *     summary: Get list of identifiers of an Author by BBID
 *     description: Returns the list of identifiers of an Author
 *     operationId: getIdentifiersOfAuthorByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bbid
 *         in: path
 *         description: BBID of the Author
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of identifiers with BBID of an Author entity
 *         schema:
 *             $ref: '#/definitions/Identifiers'
 *       404:
 *         description: Author not found
 *       406:
 *         description: Invalid BBID
 */
router.get('/:bbid/identifiers',
	makeEntityLoader('Author', utils.identifiersRelations, authorError),
	async (req, res, next) => {
		const authorIdentifiersList = await getEntityIdentifiers(res.locals.entity);
		return res.status(200).send(authorIdentifiersList);
	});

/**
 *	@swagger
 * '/author/{bbid}/relationships':
 *   get:
 *     tags:
 *       - Lookup Requests
 *     summary: Get list of relationships of an Author by BBID
 *     description: Returns the list of relationships of an Author
 *     operationId: getRelationshipsOfAuthorByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: bbid
 *         in: path
 *         description: BBID of the Author
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: List of relationships with BBID of an Author entity
 *         schema:
 *             $ref: '#/definitions/Relationships'
 *       404:
 *         description: Author not found
 *       406:
 *         description: Invalid BBID
 */

router.get('/:bbid/relationships',
	makeEntityLoader('Author', utils.relationshipsRelations, authorError),
	async (req, res, next) => {
		const authorRelationshipList = await getEntityRelationships(res.locals.entity);
		return res.status(200).send(authorRelationshipList);
	});

/**
 *	@swagger
 * '/author':
 *   get:
 *     tags:
 *       - Browse Requests
 *     summary: Get list of Authors which are related to an Edition or Work
 *     description: Returns the list of Author, When one of the bbid of Work or Edition is passed as query parameter
 *     operationId: getRelatedAuthorByBbid
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: work
 *         in: query
 *         description: BBID of the Work
 *         required: false
 *         type: bbid
 *       - name: edition
 *         in: query
 *         description: BBID of the Edition
 *         required: false
 *         type: bbid
 *     responses:
 *       200:
 *         description: List of Authors which are related to either Work or Edition
 *         schema:
 *             $ref: '#/definitions/BrowsedAuthors'
 *       404:
 *         description: Work not found or Edition not found
 *       406:
 *         description: Invalid BBID paased in query params
 */

router.get('/',
	validateBrowseRequestQueryParameters(['edition', 'author', 'edition-group', 'work']),
	makeEntityLoader(null, utils.relationshipsRelations, 'Entity not found', true),
	loadEntityRelationshipsForBrowse(),
	async (req, res) => {
		function relationshipsFilterMethod(relatedEntity) {
			if (req.query.type) {
				return _.toLower(relatedEntity.authorType) === req.query.type;
			}
			return true;
		}
		const authorRelationshipList = await utils.getBrowsedRelationships(
			req.app.locals.orm, res.locals, 'Author',
			getAuthorBasicInfo, authorBasicRelations, relationshipsFilterMethod
		);
		return res.status(200).send({
			bbid: req.query.bbid,
			relatedAuthors: authorRelationshipList
		});
	});

export default router;
