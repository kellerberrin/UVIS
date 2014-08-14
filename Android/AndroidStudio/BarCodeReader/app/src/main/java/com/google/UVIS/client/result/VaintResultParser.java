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

import com.google.UVIS.Result;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;



public final class VaintResultParser extends ResultParser {

	private static final Pattern PATTERN_VAINT_BEGIN = Pattern.compile("<VaInt>");
	private static final Pattern PATTERN_VAINT_END = Pattern.compile("</VaInt>");
	private static final Pattern PATTERN_VAINT_FIELD = Pattern.compile("<[a-zA-Z0-9]+/>");
	
	
	
	@Override
	public VaintParsedResult parse(Result result) 
	{
	    
	  // Get the raw string and parse it.
	  
		String rawString = result.getText();
	  
		Matcher beginMatcher = PATTERN_VAINT_BEGIN.matcher(rawString);
		Matcher endMatcher = PATTERN_VAINT_END.matcher(rawString);

	  
		if (beginMatcher.find() && endMatcher.find()) 
		{
		  
			Matcher fieldMatcher = PATTERN_VAINT_FIELD.matcher(rawString);
		  
			List<String> VaintFields = new ArrayList<String>();

			while (fieldMatcher.find()) 
			{
				VaintFields.add(fieldMatcher.group());
			}
		  
		  		  
			if (VaintFields.size() != 3)
			{
			  
				return null;
				
			}
		  

			String trustedIdentifier = "Owner: " + VaintFields.get(0);
			String productIdentifier = "GTIN:  " + VaintFields.get(1);
			String uniqueIdentifier =  "Serial:" + VaintFields.get(2);


			return new VaintParsedResult(trustedIdentifier
				                        , productIdentifier
				                        , uniqueIdentifier);
	  

		} 
		else 
		{
	  
			return null;

		}	  

	}

}







