/*
 * Copyright (c) 2014 kellerberrin
 * Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *     limitations under the License.
 */

package com.google.UVIS.client.result;



public final class VaintParsedResult extends ParsedResult {

	  private final String trustedIdentifier;
	  private final String productIdentifier;
	  private final String uniqueIdentifier;

	  public VaintParsedResult(String TrustedIdentifier,
	                         String ProductIdentifier,
	                         String UniqueIdentifier) {
	    super(ParsedResultType.VAINT);
	    this.trustedIdentifier = TrustedIdentifier;
	    this.productIdentifier = ProductIdentifier;
	    this.uniqueIdentifier = UniqueIdentifier;
	  }



	  public String getTrustedIdentifier() {
	    return trustedIdentifier;
	  }

	  public String getProductIdentifier() {
	    return productIdentifier;
	  }

	  public String getUniqueIdentifier() {
	    return uniqueIdentifier;
	  }


	  @Override
	  public String getDisplayResult() {
	    StringBuilder result = new StringBuilder(100);
	    maybeAppend(trustedIdentifier, result);
	    maybeAppend(productIdentifier, result);
	    maybeAppend(uniqueIdentifier, result);
	    return result.toString();
	  }

	}

